import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Authenticated from "./components/helpers/Authenticated";
import MainApp from "./routes/MainApp";
import Test from "./routes/Test";
import Channel from "./routes/Channel";
import ModalDialog from "./components/ModalDialog";
import { JSX } from "preact";
import { useState } from "preact/hooks";
interface Button {
    text: string;
    id: string;
    primary?: boolean;
}

const App = () => {
    const [modalDialog, setModalDialog] = useState<JSX.Element>();
    // eslint-disable-next-line no-unused-vars
    const showModalDialog = (title: string, content: string, buttons: Button[], onClose: (button: string) => void) => {
        setModalDialog(<ModalDialog title={title} content={content} buttons={buttons} onClose={onClose} />);
    };
    const hideModalDialog = () => {
        setModalDialog(undefined);
    };
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={
                        <Authenticated>
                            <Navigate to="/app" />
                            {/* TODO: Navigate to Nextflow information page if not signed in */}
                        </Authenticated>
                    } />
                    <Route path="/app" element={
                        <Authenticated>
                            <MainApp />
                        </Authenticated>
                    } />
                    <Route path="/test/*" element={
                        <Test />
                    } />
                    <Route path="/channel/*" element={
                        <Authenticated>
                            <Channel showModalDialog={showModalDialog} hideModalDialog={hideModalDialog} />
                        </Authenticated>
                    } />
                </Routes>
            </BrowserRouter>
            {modalDialog ? modalDialog : <></>}
        </>
    );
};

export default App;
