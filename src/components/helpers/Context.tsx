import { ComponentChildren } from "preact";
import { Helmet } from "react-helmet";
import { BrowserRouter } from "react-router-dom";
import ModalDialog from "../ModalDialog";

// FIXME: ModalDialog, ContextMenu, Tooltip
export const Context = ({ children }: { children: ComponentChildren }) => {
    return (
        <>
            <Helmet></Helmet>
            <BrowserRouter>{children}</BrowserRouter>
            {/* <ModalDialog />
            <ContextMenu />
            <Tooltip /> */}
        </>
    );
};
