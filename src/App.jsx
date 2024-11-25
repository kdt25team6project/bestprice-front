import Router from "./Router";
import { RecoilRoot } from "recoil";
import GlobalStyles from "./styles/GlobalStyles";

function App() {
  return (
    <>
      <RecoilRoot>
        <Router />
        <GlobalStyles />
      </RecoilRoot>
    </>
  );
}

export default App;
