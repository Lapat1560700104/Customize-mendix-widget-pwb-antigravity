declare module "mendix/components/Icon" {
    import { Component } from "react";
    import { WebIcon } from "mendix";

    export interface IconProps {
        icon?: WebIcon;
        className?: string;
    }

    export class Icon extends Component<IconProps> {}
}
