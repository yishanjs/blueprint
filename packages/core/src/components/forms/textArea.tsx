/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import classNames from "classnames";
import * as React from "react";
import { polyfill } from "react-lifecycles-compat";
import { Classes } from "../../common";
import { DISPLAYNAME_PREFIX, IIntentProps, IProps, removeNonHTMLProps } from "../../common/props";

const DEFAULT_RIGHT_ELEMENT_WIDTH = 10;
const DEFAULT_TEXTAREA_ELEMENT_HEIGHT = 30;

export interface ITextAreaProps
    extends IIntentProps,
        IProps,
        React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    /**
     * Whether the text area should take up the full width of its container.
     */
    fill?: boolean;

    /**
     * Whether the text area should appear with large styling.
     */
    large?: boolean;

    /**
     * Whether the text area should appear with small styling.
     */
    small?: boolean;

    /**
     * Whether the text area should automatically grow vertically to accomodate content.
     */
    growVertically?: boolean;

    /**
     * Ref handler that receives HTML `<textarea>` element backing this component.
     */
    inputRef?: (ref: HTMLTextAreaElement | null) => any;

    /**
     * Element to render on right side of input.
     * For best results, use a minimal button, tag, or small spinner.
     */
    rightElement?: JSX.Element;

    rowsMax?: number;

    rowsMin?: number;
}

export interface ITextAreaState {
    height: number;
    rightElementWidth: number;
}

// this component is simple enough that tests would be purely tautological.
/* istanbul ignore next */
@polyfill
export class TextArea extends React.PureComponent<ITextAreaProps, ITextAreaState> {
    public static displayName = `${DISPLAYNAME_PREFIX}.TextArea`;
    public state: ITextAreaState = {
        height: DEFAULT_TEXTAREA_ELEMENT_HEIGHT,
        rightElementWidth: DEFAULT_RIGHT_ELEMENT_WIDTH,
    };
    private internalTextAreaRef: HTMLTextAreaElement;
    private shadowTextAreaRef: HTMLTextAreaElement;
    private rightElement: HTMLSpanElement;

    public componentDidMount() {
        const height = this.internalTextAreaRef.scrollHeight;
        this.setState({
            height,
        });
        if (this.rightElement != null) {
            const rightElementWidth = this.rightElement.clientWidth || DEFAULT_RIGHT_ELEMENT_WIDTH;
            this.setState({
                rightElementWidth,
            });
        }
    }

    public componentDidUpdate(_: ITextAreaProps, { rightElementWidth }: ITextAreaState) {
        if (this.rightElement != null) {
            const newRightElementWidth =
                this.rightElement.clientWidth || DEFAULT_RIGHT_ELEMENT_WIDTH;
            if (rightElementWidth !== newRightElementWidth) {
                this.setState({
                    rightElementWidth: newRightElementWidth,
                });
            }
        }
    }

    public render() {
        const {
            className,
            fill,
            inputRef,
            intent,
            large,
            small,
            growVertically,
            rows = 1,
            style,
            ...htmlProps
        } = this.props;

        const rootClasses = classNames(
            Classes.INPUT_GROUP,
            Classes.intentClass(intent),
            {
                [Classes.FILL]: fill,
                [Classes.LARGE]: large,
                [Classes.SMALL]: small,
            },
            className
        );

        // add explicit height style while preserving user-supplied styles if they exist
        const textAreaStyle: React.CSSProperties = {
            ...style,
            height: `${this.state.height}px`,
            paddingRight: `${this.state.rightElementWidth}px`,
        };
        return (
            <div className={rootClasses}>
                <textarea
                    className={Classes.INPUT}
                    ref={this.handleInternalRef}
                    style={textAreaStyle}
                    rows={rows}
                    {...removeNonHTMLProps(htmlProps)}
                    onChange={this.handleChange}
                />
                <textarea
                    ref={this.handleShadowInputRef}
                    className={Classes.INPUT}
                    style={{
                        left: 0,
                        overflow: "hidden",
                        paddingRight: `${this.state.rightElementWidth}px`,
                        position: "absolute",
                        top: 0,
                        border: 0,
                        transform: "translateZ(0)",
                        visibility: "hidden",
                    }}
                    rows={rows}
                />
                {this.maybeRenderRightElement()}
            </div>
        );
    }

    private syncHeight = () => {
        if (!window) {
            return;
        }
        const input = this.internalTextAreaRef;
        const inputShadow = this.shadowTextAreaRef;

        const computedStyle = window.getComputedStyle(input) as any;
        inputShadow.style.width = computedStyle.width;
        inputShadow.value = input.value || this.props.placeholder || "x";

        const boxSizing = computedStyle["box-sizing"];
        const padding =
            getStyleValue(computedStyle, "padding-bottom") +
            getStyleValue(computedStyle, "padding-top");
        const border =
            getStyleValue(computedStyle, "border-bottom-width") +
            getStyleValue(computedStyle, "border-top-width");

        // The height of the inner content
        const innerHeight = inputShadow.scrollHeight - padding;

        // Measure height of a textarea with a single row
        inputShadow.value = "x";
        const singleRowHeight = inputShadow.scrollHeight - padding;

        // The height of the outer content
        let outerHeight = innerHeight;

        if (this.props.rowsMin) {
            outerHeight = Math.max(Number(this.props.rowsMin) * singleRowHeight, outerHeight);
        }
        if (this.props.rowsMax) {
            outerHeight = Math.min(Number(this.props.rowsMax) * singleRowHeight, outerHeight);
        }
        outerHeight = Math.max(outerHeight, singleRowHeight);
        // Take the box sizing into account for applying this value as a style.
        const outerHeightStyle = outerHeight + (boxSizing === "border-box" ? padding + border : 0);
        console.debug("TextArea | syncHeight", { outerHeightStyle });
        this.setState({
            height: outerHeightStyle,
        });
    };

    private handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (this.props.growVertically) {
            this.syncHeight();
        }

        if (this.props.onChange != null) {
            this.props.onChange(e);
        }
    };

    // hold an internal ref for growVertically
    private handleInternalRef = (ref: HTMLTextAreaElement | null) => {
        this.internalTextAreaRef = ref;
        if (this.props.inputRef != null) {
            this.props.inputRef(ref);
        }
    };

    private handleRightElementRef = (ref: HTMLSpanElement | null) => {
        this.rightElement = ref;
    };

    private handleShadowInputRef = (ref: HTMLTextAreaElement | null) => {
        this.shadowTextAreaRef = ref;
    };

    private maybeRenderRightElement() {
        const { rightElement } = this.props;
        if (rightElement == null) {
            return undefined;
        }
        return (
            <span className={Classes.INPUT_ACTION} ref={this.handleRightElementRef}>
                {rightElement}
            </span>
        );
    }
}

function getStyleValue(computedStyle: CSSStyleDeclaration, property: string) {
    return parseInt((computedStyle as any)[property], 10) || 0;
}
