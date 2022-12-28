import styled, { css } from "styled-components";
import { CompassNorthwest24Regular, Add24Regular, PersonFeedback24Regular, Settings24Regular } from "@fluentui/react-icons";
import { useAppSelector } from "../utilities/redux/redux";
import { shallowEqual } from "react-redux";

const HomeContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    min-height: 0px;
    overflow: hidden;
    color: white;
`;

const Welcome = styled.div`
    height: auto;
    & > :not([hidden]) ~ :not([hidden]) {
        margin-top: 0.5rem;
    }
`;

const HomeTitle = styled.h1`
    font-size: 48px;
`;

const HomeCard = styled.div`
    border-width: 1px;
    border-radius: 9px;
    display: flex;
    padding: 6px;
    & > :not([hidden]) ~ :not([hidden]) {
        margin-left: 0.5rem;
    }
    align-items: center;
    ${props => props.darkTheme ? css`
        background-color: rgb(156 163 175 / 0.5);
    ` : css`
        background-color: rgb(229 231 235);
    `}
    user-select: none;
`;

const HomeCardText = styled.div`
    display: flex;
    flex-direction: column;
`;

const Home = () => {
    const darkTheme = useAppSelector(state => state.preferences.theme === "dark", shallowEqual);
    return (
        <HomeContainer>
            <Welcome>
                <HomeTitle>Welcome to Easylink</HomeTitle>
                <HomeCard darkTheme={darkTheme}>
                    <Add24Regular />
                    <HomeCardText>
                        <b>Create a channel</b>
                        <p>Find some friends and add them to a grand party.</p>
                    </HomeCardText>
                </HomeCard>
                <HomeCard darkTheme={darkTheme}>
                    <CompassNorthwest24Regular />
                    <HomeCardText>
                        <b>Discover Easylink</b>
                        <p>Take a tour of the app.</p>
                    </HomeCardText>
                </HomeCard>
                <HomeCard darkTheme={darkTheme}>
                    <PersonFeedback24Regular />
                    <HomeCardText>
                        <b>Give feedback</b>
                        <p>Report bugs and suggest features.</p>
                    </HomeCardText>
                </HomeCard>
                <HomeCard darkTheme={darkTheme}>
                    <Settings24Regular />
                    <HomeCardText>
                        <b>Configure Easylink</b>
                        <p>Personalise the app.</p>
                    </HomeCardText>
                </HomeCard>
                
            </Welcome>
        </HomeContainer>
    );
};

export default Home;
