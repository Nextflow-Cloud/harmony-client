import { Logo } from "./logo";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Authenticated from "./components/helpers/Authenticated";
import MainApp from "./routes/MainApp";
import Test from "./routes/Test";
import CallConnector from "./routes/CallConnector";
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
                    <Route path="/" element={<Logo />} />
                    <Route path="/app" element={
                        <Authenticated>
                            <MainApp />
                        </Authenticated>
                    } />
                    <Route path="/test/*" element={
                        <Test />
                    } />
                    <Route path="/call" element={
                        <CallConnector />
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
    // return (
    //     <>
    //         <Logo />
    //         <p>Hello Vite + Preact!</p>
    //         <p>
    //             <a
    //                 class="link"
    //                 href="https://preactjs.com/"
    //                 target="_blank"
    //                 rel="noopener noreferrer"
    //             >
    //       Learn Preact
    //             </a>
    //         </p>
    //     </>
    // );
};

export default App;
