import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "../utils/colorScheme";
import { useRouter } from "next/router";

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme} resetCSS>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default MyApp;
