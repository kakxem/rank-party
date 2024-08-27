/// <reference types="vite/client" />

import { LiteYTEmbed } from "@justinribeiro/lite-youtube";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "lite-youtube": React.DetailedHTMLProps<
        React.HTMLAttributes<LiteYTEmbed>,
        LiteYTEmbed
      > & {
        videoid: string;
        videotitle: string | undefined;
      };
    }
  }
}
