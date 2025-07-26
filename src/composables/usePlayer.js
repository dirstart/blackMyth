import { computed } from "vue";
import { useGlobalPlayer } from "../store/player";

export function usePlayer() {
	// 使用全局状态管理
	const globalPlayer = useGlobalPlayer();

	return {
		// 状态
		musicPlaylist: globalPlayer.playerState.musicPlaylist,
		currentTrack: globalPlayer.currentTrack,
		currentTrackIndex: globalPlayer.playerState.currentTrackIndex,
		isPlaying: computed(() => globalPlayer.playerState.isPlaying),
		currentPlayTime: globalPlayer.playerState.currentPlayTime,
		currentVolume: globalPlayer.playerState.currentVolume,
		playbackMode: globalPlayer.playerState.playbackMode,
		isLyricsVisible: globalPlayer.playerState.isLyricsVisible,
		showWaveform: globalPlayer.playerState.showWaveform,
		playbackProgress: globalPlayer.playbackProgress,
		formattedCurrentTime: globalPlayer.formattedCurrentTime,
		formattedTrackDuration: globalPlayer.formattedTrackDuration,
		playbackModeIcon: globalPlayer.playbackModeIcon,
		playbackModeText: globalPlayer.playbackModeText,
		playerState: globalPlayer.playerState,

		// 方法
		...globalPlayer,
	};
}
