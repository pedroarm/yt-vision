/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useRef, useState } from 'react';
import YTPlayer from 'youtube-player';

import { YouTubePlayer, CustomEvent, PlayerStates } from '../../types';

import styles from './styles.module.scss';

export type RecursiveVoid = (func: RecursiveVoid) => void;

export type VideoAmbilightProps = {
  videoId: string;
  videoPlayer?: YouTubePlayer;
  setVideoPlayer: (player: YouTubePlayer) => void;
  onChangePlayerState: (state: PlayerStates) => void;
};

const useAnimationFrame = (callback: (deltaTime: number) => void) => {
  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();

  const animate = (time: number) => {
    if (previousTimeRef.current != undefined) {
      const deltaTime: number = time - previousTimeRef.current;
      callback(deltaTime);
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current as number);
  }, []);
};

export default function VideoAmbilight({ videoId, videoPlayer, setVideoPlayer, onChangePlayerState }: VideoAmbilightProps) {
  const [ambilightPlayer, setAmbilightPlayer] = useState<YouTubePlayer>();

  const videoReady = useCallback((event: CustomEvent) => {}, []);

  const videoStateChange = useCallback(
    (event: CustomEvent) => {
      switch (event.data) {
        case PlayerStates.PLAYING:
          onChangePlayerState(PlayerStates.PLAYING);
          ambilightPlayer?.seekTo(event.target.getCurrentTime(), true);
          ambilightPlayer?.playVideo();
          break;
        case PlayerStates.PAUSED:
          onChangePlayerState(PlayerStates.PAUSED);
          ambilightPlayer?.seekTo(event.target.getCurrentTime(), true);
          ambilightPlayer?.pauseVideo();
          break;
      }
    },
    [ambilightPlayer]
  );

  const optimizeAmbilight = useCallback((event: CustomEvent) => {
    const qualityLevels: string[] = [...event?.target?.getAvailableQualityLevels()];
    event?.target?.mute();
    if (qualityLevels && qualityLevels.length && qualityLevels.length > 0) {
      qualityLevels.reverse();
      const lowestLevel = qualityLevels[qualityLevels.findIndex((q) => q !== 'auto')];
      event.target.setPlaybackQuality(lowestLevel);
    }
  }, []);

  const ambilightStateChange = useCallback(
    (event: CustomEvent) => {
      switch (event.data) {
        case PlayerStates.BUFFERING:
        case PlayerStates.PLAYING:
          optimizeAmbilight(event);
          break;
      }
    },
    [optimizeAmbilight]
  );

  const ambilightReady = useCallback(
    (event: CustomEvent) => {
      optimizeAmbilight(event);
    },
    [optimizeAmbilight]
  );

  const step = useCallback(() => {
    ambilightPlayer?.seekTo(videoPlayer?.getCurrentTime() || 0, true);
  }, [ambilightPlayer, videoPlayer]);

  useAnimationFrame(step);

  useEffect(() => {
    const video = YTPlayer('ambilight-video', {
      videoId,
    }) as unknown as YouTubePlayer;

    const ambilight = YTPlayer('ambilight', {
      videoId,
    }) as unknown as YouTubePlayer;

    setVideoPlayer(video);
    setAmbilightPlayer(ambilight);
  }, []);

  useEffect(() => {
    videoPlayer?.loadVideoById(videoId);
    ambilightPlayer?.loadVideoById(videoId);
  }, [videoId]);

  useEffect(() => {
    videoPlayer?.on('ready', videoReady as () => void);
    videoPlayer?.on('stateChange', videoStateChange as () => void);

    ambilightPlayer?.on('ready', ambilightReady as () => void);
    ambilightPlayer?.on('stateChange', ambilightStateChange as () => void);
  }, [videoPlayer, ambilightPlayer, videoReady, ambilightReady, videoStateChange, ambilightStateChange]);

  return (
    <div className={styles.videoWrapper}>
      <div className={styles.ambilightWrapper}>
        <div className={styles.aspectRatio}>
          <div className={styles.ambilight} id="ambilight"></div>
          <div className={styles.ambilightVideo} id="ambilight-video"></div>
        </div>
      </div>
    </div>
  );
}
