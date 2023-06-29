import type { NextPage } from "next";
import {
	PanelLeft,
	PauseCircle,
	PlayCircle,
	RotateCw,
	Search,
	Volume2,
	VolumeX,
} from "lucide-react";
import VideoAmbilight from "../components/VideoAmbilight";

import styles from "./styles.module.scss";
import { useState } from "react";
import { PlayerStates, YouTubePlayer } from "../types";

const Home: NextPage = () => {
	const [videoPlayer, setVideoPlayer] = useState<YouTubePlayer>();
	const [videoPlayerState, setVideoPlayerState] = useState<PlayerStates>(PlayerStates.UNSTARTED);
	const [isVideoMuted, setIsVideoMuted] = useState<boolean>(false);

	const [searchValue, setSearchValue] = useState<string>("https://www.youtube.com/watch?v=G5kzUpWAusI");
	const [videoId, setVideoId] = useState<string>("G5kzUpWAusI");

	const handleMuteVideo = () => {
		videoPlayer?.mute();
		setIsVideoMuted(true);
	};

	const handleUnMuteVideo = () => {
		videoPlayer?.unMute();
		setIsVideoMuted(false);
	};


	function formatURLAndGetParams(url: string): { formattedURL: string; queryParams: URLSearchParams | null } {
		let formattedURL = "";
		let queryParams: URLSearchParams | null = null;
	
		try {
			const urlObj = new URL(url);
			const { hostname, pathname, search } = urlObj;

			const domain = hostname.replace("www.", "");
	
			formattedURL = `${domain}${pathname}${search}`;
	
			queryParams = urlObj.searchParams;
		} catch (error) {
			formattedURL = url;
		}
	
		return { formattedURL, queryParams };
	}

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = event.target;

		const resolveUrl = formatURLAndGetParams(value);

		setSearchValue(resolveUrl.formattedURL);
		const videoId = resolveUrl.queryParams?.get("v");

		if (videoId) {
			setVideoId(videoId);
		}
	};

	return (
		<div className={styles.container}>
			<aside className={styles.sideMenu}>
				<div className={styles.icon}>
					{videoPlayerState === 1 ? (
						<PauseCircle color="#fff" size={22} onClick={() => videoPlayer?.pauseVideo()} />
					) : (
						<PlayCircle color="#fff" size={22} onClick={() => videoPlayer?.playVideo()} />
					)}
				</div>
				<div className={styles.icon}>
					{isVideoMuted ? (
						<VolumeX color="#fff" size={22} onClick={handleUnMuteVideo} />
					) : (
						<Volume2 color="#fff" size={22} onClick={handleMuteVideo} />
					)}
				</div>
				<div className={styles.icon}>
					<Search color="#fff" size={22} />
				</div>
			</aside>
			<div className={styles.contentWrapper}>
				<header className={styles.navBar}>
					<div className={styles.icon}>
						<PanelLeft color="#fff" size={22} />
					</div>

					<div className={styles.addressBar}>
						<span>Aa</span>
						<div className={styles.search}>
							<svg
								width="16"
								height="16"
								viewBox="0 0 16 16"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<g opacity="0.8">
									<path
										d="M11.5 6H11V3.5C11 2.70435 10.6839 1.94129 10.1213 1.37868C9.55871 0.81607 8.79565 0.5 8 0.5C7.20435 0.5 6.44129 0.81607 5.87868 1.37868C5.31607 1.94129 5 2.70435 5 3.5V6H4.5C3.96974 6.00058 3.46137 6.21148 3.08643 6.58643C2.71148 6.96137 2.50058 7.46974 2.5 8V13.5C2.50058 14.0303 2.71148 14.5386 3.08643 14.9136C3.46137 15.2885 3.96974 15.4994 4.5 15.5H11.5C12.0303 15.4994 12.5386 15.2885 12.9136 14.9136C13.2885 14.5386 13.4994 14.0303 13.5 13.5V8C13.4994 7.46974 13.2885 6.96137 12.9136 6.58643C12.5386 6.21148 12.0303 6.00058 11.5 6ZM10 6H6V3.5C6 2.96957 6.21071 2.46086 6.58579 2.08579C6.96086 1.71071 7.46957 1.5 8 1.5C8.53043 1.5 9.03914 1.71071 9.41421 2.08579C9.78929 2.46086 10 2.96957 10 3.5V6Z"
										fill="white"
									/>
								</g>
							</svg>

							<input
								type="text"
								value={searchValue}
								placeholder="Type a video URL"
								onChange={handleInputChange}
								onFocus={(event) => event.target.select()}
							/>
						</div>
						<RotateCw color="#fff" size={18} />
					</div>

					<div className={styles.actions}></div>
				</header>
				<VideoAmbilight
					videoId={videoId}
					videoPlayer={videoPlayer}
					setVideoPlayer={setVideoPlayer}
					onChangePlayerState={setVideoPlayerState}
				/>

				<footer className={styles.footer}>
					<span className={styles.ellipse} />
					<span className={styles.rectangle} />
				</footer>
			</div>
		</div>
	);
};

export default Home;
