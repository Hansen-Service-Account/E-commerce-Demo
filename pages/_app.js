import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "../utils/colorScheme";
import { useRouter } from "next/router";

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  return (
    <ChakraProvider theme={theme} resetCSS>
      <Component {...pageProps} key={router.asPath} />
    </ChakraProvider>
  );
}

export default MyApp;
