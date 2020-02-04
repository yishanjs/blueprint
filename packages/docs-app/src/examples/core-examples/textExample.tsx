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

import * as React from "react";

import { Text, TextArea } from "@yishanzhilubp/core";
import { Example, handleStringChange, IExampleProps } from "@yishanzhilubp/docs-theme";

export interface ITextExampleState {
    textContent: string;
}

export class TextExample extends React.PureComponent<IExampleProps, ITextExampleState> {
    public state: ITextExampleState = {
        textContent: `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Aenean finibus eget enim non accumsan.
            Nunc lobortis luctus magna eleifend consectetur.`,
    };

    private onInputChange = handleStringChange((textContent: string) => this.setState({ textContent }));

    public render() {
        return (
            <Example options={false} {...this.props}>
                <Text ellipsize={true}>
                    {this.state.textContent}
                    &nbsp;
                </Text>
                <TextArea
                    growVertically={true}
                    rows={3}
                    fill={true}
                    onChange={this.onInputChange}
                    value={this.state.textContent}
                />
            </Example>
        );
    }
}
