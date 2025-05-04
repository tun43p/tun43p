import { JSX, onMount, createSignal } from "solid-js";

export default function VideoComponent(): JSX.Element {
  let videoRef!: HTMLVideoElement;

  const sourceVideoUrl = "https://www.youtube.com/watch?v=tZm1yYA-PNo";

  const [muted, setMuted] = createSignal(true);
  const [tooltip, setTooltip] = createSignal<string | null>(null);

  onMount(() => {
    videoRef.play();
  });

  return (
    <div>
      <video
        ref={videoRef}
        class="absolute top-0 left-0 w-full h-full object-cover z-[-1]"
        src="/background-video.mp4"
        loop
        muted={muted()}
        disablepictureinpicture
        disableremoteplayback
      />
      <button
        class="absolute bottom-4 right-4 z-[1]"
        onClick={() => setMuted((prev) => !prev)}
        onMouseOver={() => setTooltip(`video source: ${sourceVideoUrl}`)}
        onMouseLeave={() => setTooltip(null)}
      >
        {muted() ? "unmute" : "mute"}
      </button>

      {tooltip() !== null && (
        <div class="absolute bottom-10 right-4 z-[1] bg-black text-white p-2 opacity-50">
          {tooltip()}
        </div>
      )}
    </div>
  );
}
