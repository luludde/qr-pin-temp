import { MsalProvider,} from "@azure/msal-react";
import '@ingka/svg-icon/dist/style.css';
import '@ingka/button/dist/style.css';
//import '@ingka/card/dist/style.css';
import '@ingka/focus/dist/style.css';
import { AuthContentSelector } from "./components/AuthContentSelector";
import ReactGA from "react-ga";
ReactGA.initialize("UA-XXXXX-Y"); // Replace with password portal GA tracking ID

const App = ({ instance }) => {
  return (
    <MsalProvider instance={instance}>      
        <AuthContentSelector />              
    </MsalProvider>
  );
};

export default App;
