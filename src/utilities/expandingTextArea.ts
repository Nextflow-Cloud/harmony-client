export default (el: HTMLElement, {
    canShrink = true,
    minHeightPx = 0,
    maxHeightPx,
    minLines,
    maxLines,
}: {
    canShrink?: boolean,
    minHeightPx?: number,
    maxHeightPx?: number,
    minLines?: number,
    maxLines?: number,
} = {}) => {
    canShrink = (canShrink === true || canShrink === void 0 || canShrink === null);
    const style = window.getComputedStyle(el);
    const unpreparedLineHeight = style.getPropertyValue("line-height");
    if (unpreparedLineHeight === "normal") {
        console.error("el=%O:: line-height is unset", el);
    }
    const lineHeightPx: number = (
        unpreparedLineHeight === "normal"
            ? 1.15 * parseFloat(style.getPropertyValue("font-size"))
            : parseFloat(unpreparedLineHeight)
    );
    minHeightPx = parseFloat((minHeightPx || 0).toString()) || 0;
    maxHeightPx = parseFloat((maxHeightPx || 0).toString()) || Infinity;
    minLines = (minLines ? (Math.round(+minLines || 0) > 1 ? Math.round(+minLines || 0) : 1) : 1);
    maxLines = (maxLines ? (Math.round(+maxLines || 0) || Infinity) : Infinity);
    if (minLines > maxLines) {
        minLines = 1;
        maxLines = Infinity;
    }
    if (minHeightPx > maxHeightPx) {
        minHeightPx = 0;
        maxHeightPx = Infinity;
    }
    const topBottomBorderWidths: number = (
        parseFloat(style.getPropertyValue("border-top-width")) 
        + parseFloat(style.getPropertyValue("border-bottom-width"))
    );
    let verticalPaddings = 0;
    if (style.getPropertyValue("box-sizing") === "border-box") {
        verticalPaddings += (
            parseFloat(style.getPropertyValue("padding-top"))
            + parseFloat(style.getPropertyValue("padding-bottom"))
            + topBottomBorderWidths
        );
    }
    const oldHeightPx = parseFloat(style.height);
    if (el.tagName === "TEXTAREA") {
        el.setAttribute("rows", "1");
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore - TypeScript doesn't know about el.scrollbarWidth
    const oldScrollbarWidth: string | void = el.style.scrollbarWidth;
    el.style.height = "";
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore - TypeScript doesn't know about el.scrollbarWidth
    el.style.scrollbarWidth = "none";
    const maxHeightForMinLines = lineHeightPx * minLines + verticalPaddings;
    const scrollHeight = el.scrollHeight + topBottomBorderWidths;
    const newHeightPx = Math.max(
        canShrink === true ? minHeightPx : oldHeightPx,
        Math.min(
            maxHeightPx,
            Math.max(
                maxHeightForMinLines,
                Math.min(
                    Math.max(scrollHeight, maxHeightForMinLines)
                    - Math.min(scrollHeight, maxHeightForMinLines) < 1
                        ? maxHeightForMinLines
                        : scrollHeight,
                    (
                        maxLines > 0 && maxLines !== Infinity
                            ? lineHeightPx * maxLines + verticalPaddings
                            : Infinity
                    )
                )
            )
        )
    );
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore - TypeScript doesn't know about el.scrollbarWidth
    el.style.scrollbarWidth = oldScrollbarWidth;
    if (!Number.isFinite(newHeightPx) || newHeightPx < 0) {
        console.error("el=%O:: BUG:: Invalid return value: `%O`", el, newHeightPx);
        return;
    }
    el.style.height = `${newHeightPx}px`;
};
