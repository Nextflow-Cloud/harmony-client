import { ComponentChildren, h, JSX } from "preact";
import { forwardRef } from "preact/compat";
import { useEffect, useLayoutEffect, useImperativeHandle, useState, Ref } from "preact/hooks";

import useScroll from "../hooks/useScroll";

interface Props {
    children: ComponentChildren;
    initialReverse?: boolean;
    loadingComponent: JSX.Element;
    nextDataFn: () => void;
    nextEnd: boolean;
    nextLoading: boolean;
    previousDataFn: () => void;
    previousEnd: boolean;
    previousLoading: boolean;
}

const Scroller = forwardRef(({
    children,
    initialReverse = true,
    loadingComponent,
    nextDataFn,
    nextEnd,
    nextLoading,
    previousDataFn,
    previousEnd,
    previousLoading,
}: Props, ref) => {
    useImperativeHandle(ref, () => ({ setReverseCol, containerRef }));

    const [reverseCol, setReverseCol] = useState(initialReverse);
    const [reverseColValue, setReverseColValue] = useState<number | null>(null);
    const [scrolledToBottom, scrolledToTop, containerRef] = useScroll(reverseCol);
    const container = (containerRef as Ref<HTMLDivElement>).current;

    // This is called next render - next flex-col or flex-col-reverse is set
    useLayoutEffect(() => {
        if (reverseColValue !== null) {
            container?.scrollTo({ top: reverseColValue });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reverseColValue]);

    useEffect(() => {
        if (!container) return;
        if (scrolledToTop && !previousLoading && !previousEnd && !nextLoading) {
            if (!reverseCol) {
                const scrollTo = container.scrollTop - container.scrollHeight - container.clientHeight;
                setReverseCol(true);
                setReverseColValue(scrollTo);
            }
            previousDataFn();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [scrolledToTop, reverseCol]);
  
    useEffect(() => {
        if (!container) return;
        if (scrolledToBottom && !nextLoading && !nextEnd && !previousLoading) {
            if (reverseCol) {
                const scrollTo = container.scrollTop + container.scrollHeight - container.clientHeight;
                setReverseCol(false);
                setReverseColValue(scrollTo);
            }
            nextDataFn();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [scrolledToBottom, reverseCol]);
  
    return (
        <div style={{
            display: "flex",
            flexDirection: reverseCol ? "column-reverse" : "column",
            height: "100%",
            overflowY: "scroll",
        }} ref={containerRef as Ref<HTMLDivElement>}>
            <div>
                {previousLoading && loadingComponent}
                {children}
                {nextLoading && loadingComponent}
            </div>
        </div>
    );
});

export default Scroller;
