import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { createTheme, Theme } from "@mui/material/styles";
import createCache, { EmotionCache } from "@emotion/cache";
import rtlPlugin from "stylis-plugin-rtl";
import { prefixer } from "stylis";

const useLanguage = (): { theme: Theme; cache: EmotionCache } => {
  const { i18n } = useTranslation();
  // Set the document direction when language changes
  useEffect(() => {
    document.dir = i18n.language === "ar" ? "rtl" : "ltr";
  }, [i18n.language]);

  // Memoized theme based on language direction
  const theme = useMemo<Theme>(
    () =>
      createTheme({
        direction: i18n.language === "en" ? "ltr" : "rtl",
      }),
    [i18n.language]
  );

  const cache =
    i18n.language === "ar"
      ? createCache({
          key: "muirtl",
          stylisPlugins: [prefixer, rtlPlugin],
        })
      : createCache({ key: "muiltr" });

  return { theme, cache };
};

export default useLanguage;
