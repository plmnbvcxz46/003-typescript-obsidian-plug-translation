# Smart Selection Test Document

## English Section

Obsidian is a powerful knowledge base that works on top of a local folder of plain text Markdown files. It allows you to make connections between your notes, visualize your ideas, and organize your thinking in a way that feels natural. The plugin system is one of its strongest features, enabling developers to extend its functionality in limitless ways.

When developing a plugin, you often need to interact with the editor. The `Editor` interface provides methods to get and set the selection, retrieve text, and manipulate the cursor. Understanding how ranges work is crucial. A range consists of a start position (anchor) and an end position (head). By manipulating these positions, you can create smart selection features like the one we are building now.

Here is a list of fruits to test word selection:

-   Apple
-   Banana
-   Cherry
-   Dragonfruit
-   Elderberry

Try selecting this sentence. Then try expanding it to the whole paragraph. Notice how the selection grows from a single word to the sentence, and finally to the entire block of text. This hierarchical selection is very useful for editing and refactoring text quickly without using the mouse.

## 中文部分

Obsidian 是一个强大的知识库，它建立在本地纯文本 Markdown 文件夹之上。它允许你在笔记之间建立联系，可视化你的想法，并以一种自然的方式组织你的思维。插件系统是其最强大的功能之一，使开发者能够以无限的方式扩展其功能。

在开发插件时，你经常需要与编辑器交互。`Editor` 接口提供了获取和设置选区、检索文本以及操作光标的方法。理解范围（Range）的工作原理至关重要。一个范围由起始位置（锚点）和结束位置（头部）组成。通过操作这些位置，你可以创建像我们现在正在构建的智能选择功能。

这里有一些水果用来测试单词选择：

-   苹果
-   香蕉
-   樱桃
-   火龙果
-   接骨木浆果

试着选中这句话。然后试着将其扩展到整个段落。注意选区是如何从一个单词增长到句子，最后覆盖整块文本的。这种分层选择对于快速编辑和重构文本非常有用，无需使用鼠标。

## Mixed Content / 混合内容

This is a sentence with some 中文 words inside it. 这是一个包含 English 单词的句子。
Programming is fun. 编程很有趣。
Do you like coding? 你喜欢写代码吗？
Yes, I do! 是的，我喜欢！

## Edge Cases / 边界情况

SingleWord.
单独的一个词。

A sentence ending with a question mark?
以问号结尾的句子？

A sentence ending with an exclamation mark!
以感叹号结尾的句子！

Sentences with leading spaces.
带有前导空格的句子。

End of file test.
文件末尾测试。
