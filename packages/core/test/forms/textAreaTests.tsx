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

import { assert } from "chai";
import { mount, ReactWrapper } from "enzyme";
import * as React from "react";

import { ITextAreaProps, TextArea } from "../../src/index";

describe("<TextArea>", () => {
  let wrapper: ReactWrapper<ITextAreaProps, any> | undefined;
  const testsContainerElement = document.createElement("div");
  document.body.appendChild(testsContainerElement);

  function mountTextInput(props: ITextAreaProps) {
    return (wrapper = mount<ITextAreaProps>(
      <TextArea {...props} />,
      // must be in the DOM for measurement
      { attachTo: testsContainerElement },
    ));
  }

  afterEach(() => {
    // clean up wrapper after each test, if it was used
    if (wrapper !== undefined) {
      wrapper.unmount();
      wrapper.detach();
      wrapper = undefined;
    }
  });

  it("has default Height 30px", () => {
    mountTextInput({});
    const textarea = wrapper.find("textarea").first();
    const textareaDOM = textarea.getDOMNode() as HTMLTextAreaElement;
    assert.equal(textareaDOM.scrollHeight, 30);
    assert.equal(textareaDOM.style.height, "30px");
  });

  it("can handle multiline default value", () => {
    mountTextInput({ defaultValue: "line1\nline2" });
    const textarea = wrapper.find("textarea").first();
    const textareaDOM = textarea.getDOMNode() as HTMLTextAreaElement;
    assert.equal(textareaDOM.scrollHeight, 48);
    assert.equal(textareaDOM.style.height, "48px");
  });

  it("can auto size when input value change", () => {
    mountTextInput({ growVertically: true });
    const textarea = wrapper.find("textarea").first();
    const textareaDOM = textarea.getDOMNode() as HTMLTextAreaElement;
    assert.equal(textareaDOM.scrollHeight, 30);
    assert.equal(textareaDOM.style.height, "30px");

    wrapper.setProps({ value: "line1\nline2" });
    textarea.simulate("change");
    assert.equal(textareaDOM.scrollHeight, 48);
    assert.equal(textareaDOM.style.height, "48px");
    wrapper.setProps({ value: "line1" });
    textarea.simulate("change");
    assert.equal(textareaDOM.scrollHeight, 30);
    assert.equal(textareaDOM.style.height, "30px");
  });
});
