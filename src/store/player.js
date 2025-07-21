import { computed, reactive, watch } from "vue";

// 全局播放器状态
const playerState = reactive({
	// 播放列表数据
	musicPlaylist: [
		{
			id: "1",
			title: "天命人",
			artist: "法老科技音乐团",
			album: "黑神话:悟空 原声带",
			duration: 252,
			cover: "https://images.pexels.com/photos/1407322/pexels-photo-1407322.jpeg?auto=compress&cs=tinysrgb&w=400",
			audioUrl: "",
			lyricsLines: ["天地玄黄", "宇宙洪荒", "日月盈昃", "辰宿列张"],
		},
		{
			id: "2",
			title: "芳草山河梦",
			artist: "法老科技音乐团",
			album: "黑神话:悟空 原声带",
			duration: 225,
			cover: "https://images.pexels.com/photos/1407322/pexels-photo-1407322.jpeg?auto=compress&cs=tinysrgb&w=400",
			audioUrl: "",
			lyricsLines: ["山河如梦", "芳草依依", "思君不见", "泪如雨下"],
		},
		{
			id: "3",
			title: "新燕归来",
			artist: "法老科技音乐团",
			album: "黑神话:悟空 原声带",
			duration: 203,
			cover: "https://images.pexels.com/photos/1407322/pexels-photo-1407322.jpeg?auto=compress&cs=tinysrgb&w=400",
			audioUrl: "",
			lyricsLines: ["新燕归来", "春满人间", "花开花落", "岁月如流"],
		},
		{
			id: "4",
			title: "金箍棒之歌",
			artist: "法老科技音乐团",
			album: "黑神话:悟空 原声带",
			duration: 296,
			cover: "https://images.pexels.com/photos/1407322/pexels-photo-1407322.jpeg?auto=compress&cs=tinysrgb&w=400",
			audioUrl: "",
			lyricsLines: ["金箍棒在手", "天下我有", "七十二变", "腾云驾雾"],
		},
		{
			id: "5",
			title: "西行之路",
			artist: "法老科技音乐团",
			album: "黑神话:悟空 原声带",
			duration: 208,
			cover: "https://images.pexels.com/photos/1407322/pexels-photo-1407322.jpeg?auto=compress&cs=tinysrgb&w=400",
			audioUrl: "",
			lyricsLines: ["西行路漫漫", "取经路遥遥", "师徒四人行", "降妖除魔"],
		},
		{
			id: "6",
			title: "魔王深谷",
			artist: "法老科技音乐团",
			album: "黑神话:悟空 原声带",
			duration: 281,
			cover: "https://images.pexels.com/photos/1407322/pexels-photo-1407322.jpeg?auto=compress&cs=tinysrgb&w=400",
			audioUrl: "",
			lyricsLines: ["深谷幽幽", "魔王现身", "刀光剑影", "惊心动魄"],
		},
		{
			id: "7",
			title: "三打白骨精",
			artist: "法老科技音乐团",
			album: "黑神话:悟空 原声带",
			duration: 197,
			cover: "https://images.pexels.com/photos/1407322/pexels-photo-1407322.jpeg?auto=compress&cs=tinysrgb&w=400",
			audioUrl: "",
			lyricsLines: ["白骨精现", "三打不退", "火眼金睛", "识破妖魔"],
		},
		{
			id: "8",
			title: "大闹天宫",
			artist: "法老科技音乐团",
			album: "黑神话:悟空 原声带",
			duration: 344,
			cover: "https://images.pexels.com/photos/1407322/pexels-photo-1407322.jpeg?auto=compress&cs=tinysrgb&w=400",
			audioUrl: "",
			lyricsLines: ["大闹天宫起", "玉帝惊慌", "天兵天将", "难挡猴王"],
		},
	],

	// 播放器状态
	currentTrackIndex: 0,
	isPlaying: false,
	currentPlayTime: 0,
	currentVolume: 0.7,
	playbackMode: "sequence", // sequence, loop, shuffle, single
	isLyricsVisible: false,
	showWaveform: false,
});

// 计算属性
const currentTrack = computed(() => playerState.musicPlaylist[playerState.currentTrackIndex] || null);

const playbackProgress = computed(() => {
	if (!currentTrack.value) return 0;
	return (playerState.currentPlayTime / currentTrack.value.duration) * 100;
});

const formattedCurrentTime = computed(() => formatTimeDisplay(playerState.currentPlayTime));
const formattedTrackDuration = computed(() =>
	currentTrack.value ? formatTimeDisplay(currentTrack.value.duration) : "00:00",
);

const playbackModeIcon = computed(() => {
	switch (playerState.playbackMode) {
		case "sequence":
			return "🔁";
		case "loop":
			return "🔂";
		case "shuffle":
			return "🔀";
		case "single":
			return "🔂";
		default:
			return "🔁";
	}
});

const playbackModeText = computed(() => {
	switch (playerState.playbackMode) {
		case "sequence":
			return "顺序播放";
		case "loop":
			return "循环播放";
		case "shuffle":
			return "随机播放";
		case "single":
			return "单曲循环";
		default:
			return "顺序播放";
	}
});

// 工具函数
function formatTimeDisplay(seconds) {
	const minutes = Math.floor(seconds / 60);
	const remainingSeconds = Math.floor(seconds % 60);
	return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
}

// 播放控制函数
function startPlayback() {
	console.log("🎵 开始播放");
	playerState.isPlaying = true;
}

function pausePlayback() {
	console.log("⏸️ 暂停播放");
	playerState.isPlaying = false;
}

function togglePlayback() {
	console.log("🎵 切换播放状态:", !playerState.isPlaying);
	playerState.isPlaying = !playerState.isPlaying;
}

function playTrackByIndex(index) {
	if (index >= 0 && index < playerState.musicPlaylist.length) {
		console.log("🎵 播放歌曲:", playerState.musicPlaylist[index].title);
		playerState.currentTrackIndex = index;
		playerState.currentPlayTime = 0;
		startPlayback();
	}
}

function playNextTrack() {
	let nextIndex = playerState.currentTrackIndex + 1;

	if (playerState.playbackMode === "shuffle") {
		nextIndex = Math.floor(Math.random() * playerState.musicPlaylist.length);
	} else if (nextIndex >= playerState.musicPlaylist.length) {
		nextIndex = playerState.playbackMode === "loop" ? 0 : playerState.musicPlaylist.length - 1;
	}

	playerState.currentPlayTime = 0;
	playTrackByIndex(nextIndex);
}

function playPreviousTrack() {
	let previousIndex = playerState.currentTrackIndex - 1;

	if (playerState.playbackMode === "shuffle") {
		previousIndex = Math.floor(Math.random() * playerState.musicPlaylist.length);
	} else if (previousIndex < 0) {
		previousIndex = playerState.playbackMode === "loop" ? playerState.musicPlaylist.length - 1 : 0;
	}

	playerState.currentPlayTime = 0;
	playTrackByIndex(previousIndex);
}

function seekToTime(time) {
	console.log("⏩ 跳转到时间:", time);
	playerState.currentPlayTime = time;
}

function adjustVolume(newVolume) {
	playerState.currentVolume = Math.max(0, Math.min(1, newVolume));
	console.log("🔊 调整音量:", Math.round(playerState.currentVolume * 100) + "%");
}

function cyclePlaybackMode() {
	const modes = ["sequence", "loop", "shuffle", "single"];
	const currentIndex = modes.indexOf(playerState.playbackMode);
	playerState.playbackMode = modes[(currentIndex + 1) % modes.length];
	console.log("🔄 切换播放模式:", playerState.playbackMode);
}

function toggleLyricsDisplay() {
	playerState.isLyricsVisible = !playerState.isLyricsVisible;
	console.log("📝 切换歌词显示:", playerState.isLyricsVisible);
}

function toggleWaveformDisplay() {
	playerState.showWaveform = !playerState.showWaveform;
	console.log("📊 切换波形图显示:", playerState.showWaveform ? "波形图模式" : "封面模式");
}

// 模拟播放进度更新
let playbackProgressInterval = null;

function startProgressTimer() {
	if (playbackProgressInterval) {
		clearInterval(playbackProgressInterval);
	}

	playbackProgressInterval = setInterval(() => {
		if (playerState.isPlaying && currentTrack.value) {
			if (playerState.currentPlayTime < currentTrack.value.duration) {
				playerState.currentPlayTime += 1;
				console.log(`⏰ 播放时间更新: ${playerState.currentPlayTime}s / ${currentTrack.value.duration}s`);
			} else {
				console.log("🎵 歌曲播放完毕，切换下一首");
				playNextTrack();
			}
		}
	}, 1000);
}

function stopProgressTimer() {
	if (playbackProgressInterval) {
		clearInterval(playbackProgressInterval);
		playbackProgressInterval = null;
	}
}

// 监听播放状态变化
let isWatcherInitialized = false;

// 导出全局状态和方法
export function useGlobalPlayer() {
	// 初始化播放状态监听（只初始化一次）
	if (!isWatcherInitialized) {
		isWatcherInitialized = true;

		watch(
			() => playerState.isPlaying,
			(playing) => {
				console.log("🎵 播放状态变化监听:", playing);
				if (playing) {
					startProgressTimer();
				} else {
					stopProgressTimer();
				}
			},
		);
	}

	return {
		// 状态
		playerState,
		currentTrack,
		playbackProgress,
		formattedCurrentTime,
		formattedTrackDuration,
		playbackModeIcon,
		playbackModeText,

		// 方法
		startPlayback,
		pausePlayback,
		togglePlayback,
		playTrackByIndex,
		playNextTrack,
		playPreviousTrack,
		seekToTime,
		adjustVolume,
		cyclePlaybackMode,
		toggleLyricsDisplay,
		toggleWaveformDisplay,
	};
}
