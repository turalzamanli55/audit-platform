export type FloatingAlign = "start" | "end";
export type FloatingPlacement = "bottom" | "top";

export type RectLike = {
  top: number;
  right: number;
  bottom: number;
  left: number;
  width: number;
  height: number;
};

export type SizeLike = {
  width: number;
  height: number;
};

export type FloatingPosition = {
  top: number;
  left: number;
  placement: FloatingPlacement;
};

export type ComputeFloatingPositionOptions = {
  align?: FloatingAlign;
  gap?: number;
  padding?: number;
  viewport?: SizeLike;
};

export function computeFloatingPosition(
  trigger: RectLike,
  menu: SizeLike,
  options: ComputeFloatingPositionOptions = {},
): FloatingPosition {
  const align = options.align ?? "end";
  const gap = options.gap ?? 6;
  const padding = options.padding ?? 8;
  const viewport = options.viewport ?? { width: 0, height: 0 };

  let placement: FloatingPlacement = "bottom";
  let top = trigger.bottom + gap;

  if (top + menu.height > viewport.height - padding) {
    const aboveTop = trigger.top - gap - menu.height;
    if (aboveTop >= padding) {
      top = aboveTop;
      placement = "top";
    } else {
      top = Math.max(padding, Math.min(top, viewport.height - menu.height - padding));
    }
  }

  let left = align === "end" ? trigger.right - menu.width : trigger.left;
  if (left + menu.width > viewport.width - padding) {
    left = viewport.width - menu.width - padding;
  }
  if (left < padding) {
    left = padding;
  }

  return { top, left, placement };
}
