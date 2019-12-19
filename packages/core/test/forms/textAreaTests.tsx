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
import { mount } from "enzyme";
import * as React from "react";

import { TextArea } from "../../src/index";

describe("<TextArea>", () => {
    const domRoot = document.createElement("div");
    document.body.appendChild(domRoot);

    it("has default Height 30px", () => {
        const wrapper = mount(<TextArea />, { attachTo: domRoot });
        const textarea = wrapper.find("textarea").first();
        const textareaDOM = textarea.getDOMNode() as HTMLTextAreaElement;
        assert.equal(textareaDOM.scrollHeight, 30);
        assert.equal(textareaDOM.style.height, "30px");
        wrapper.detach();
    });

    it("can handle multiline default value", () => {
        const wrapper = mount(<TextArea defaultValue={"line1\nline2"} />, { attachTo: domRoot });
        const textarea = wrapper.find("textarea").first();
        const textareaDOM = textarea.getDOMNode() as HTMLTextAreaElement;
        assert.equal(textareaDOM.scrollHeight, 48);
        assert.equal(textareaDOM.style.height, "48px");
        wrapper.detach();
    });

    it("can auto size when input value change", () => {
        const wrapper = mount(<TextArea growVertically />, { attachTo: domRoot });
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
        wrapper.detach();
    });

    after(function() {
        document.body.removeChild(domRoot);
    });

    // it("doesn't resize by default", () => {
    //     const wrapper = mount(<TextArea />);
    //     const textarea = wrapper.find("textarea").first();

    //     textarea.simulate("change", {
    //         target: {
    //             scrollHeight: textarea.getDOMNode().scrollHeight,
    //         },
    //     });

    //     assert.equal((textarea.getDOMNode() as HTMLElement).style.height, "");
    // });

    // it("doesn't clobber user-supplied styles", () => {
    //     const wrapper = mount(<TextArea growVertically={true} style={{ marginTop: 10 }} />);
    //     const textarea = wrapper.find("textarea").first();

    //     textarea.simulate("change", { target: { scrollHeight: 500 } });

    //     assert.equal((textarea.getDOMNode() as HTMLElement).style.marginTop, "10px");
    // });
    // it("can fit large initial content", () => {
    //     const initialValue = `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    //     Aenean finibus eget enim non accumsan.
    //     Nunc lobortis luctus magna eleifend consectetur.
    //     Suspendisse ut semper sem, quis efficitur felis.
    //     Praesent suscipit nunc non semper tempor.
    //     Sed eros sapien, semper sed imperdiet sed,
    //     dictum eget purus. Donec porta accumsan pretium.
    //     Fusce at felis mattis, tincidunt erat non, varius erat.`;
    //     const wrapper = mount(
    //         <TextArea growVertically={true} defaultValue={initialValue} style={{ marginTop: 10 }} />
    //     );
    //     const textarea = wrapper.find("textarea");
    //     const scrollHeightInPixels = `${(textarea.getDOMNode() as HTMLElement).scrollHeight}px`;
    //     assert.equal((textarea.getDOMNode() as HTMLElement).style.height, scrollHeightInPixels);
    // });
});
