import "styled-components";
import type { IGardenTheme } from "@zendesk-ui/react-components";

declare module "styled-components" {
  export interface DefaultTheme extends IGardenTheme {}
}
