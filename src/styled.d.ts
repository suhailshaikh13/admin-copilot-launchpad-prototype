import "styled-components";
import type { IGardenTheme } from "@zendeskgarden/react-theming";

declare module "styled-components" {
  export interface DefaultTheme extends IGardenTheme {}
}
