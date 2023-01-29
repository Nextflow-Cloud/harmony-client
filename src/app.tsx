import { Routes, Route, Navigate } from "react-router-dom";
import Authenticated from "./components/helpers/Authenticated";
import MainApp from "./routes/MainApp";
import ModalDialog from "./components/ModalDialog";
import { JSX } from "preact";
import { useState } from "preact/hooks";
import { Context } from "./components/helpers/Context";
import Authenticate from "./routes/Authenticate";
interface Button {
    text: string;
    id: string;
    primary?: boolean;
}

const App = () => {
    const [modalDialog, setModalDialog] = useState<JSX.Element>();
    // eslint-disable-next-line no-unused-vars
    const showModalDialog = (
        title: string,
        content: string,
        buttons: Button[],
        onClose: (button: string) => void,
    ) => {
        setModalDialog(
            <ModalDialog
                title={title}
                content={content}
                buttons={buttons}
                onClose={onClose}
            />,
        );
    };
    const hideModalDialog = () => {
        setTimeout(() => {
            setModalDialog(undefined);
        }, 500);
    };

    return (
        <>
            <Context>
                <Routes>
                    <Route
                        path="/"
                        element={
                            <Authenticated>
                                <Navigate to="/app" />
                                {/* TODO: Navigate to Nextflow information page if not signed in */}
                            </Authenticated>
                        }
                    />
                    <Route path="/authenticate" element={<Authenticate />} />
                    <Route
                        path="/app/*"
                        element={
                            <Authenticated>
                                <MainApp
                                    showModalDialog={showModalDialog}
                                    hideModalDialog={hideModalDialog}
                                />
                            </Authenticated>
                        }
                    />
                </Routes>
            </Context>
            {modalDialog ? modalDialog : <></>}
        </>
    );
};

export default App;
