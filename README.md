# Tengvara Transskribilo / Tengwar Transcriber

This is a semi-automated transcriber for the constructed writing system ([Tengwar](https://tolkiengateway.net/wiki/Tengwar)) and the constructed language Esperanto ([ISO 639-2](https://www.loc.gov/standards/iso639-2/php/code_list.php) code EPO), based on [Eric S. Raymond's mode](http://www.catb.org/~esr/tengwar/esperanto-tengwar.html). Written in TypeScript, text rewriting is accomplished using a subsequential transducer to compactly and efficiently convert Esperanto text into LaTeX code (using the [TengwarScript](https://ctan.org/pkg/tengwarscript) package) that, with some editing, can be compiled into beautiful script such as the following:

![](/ekzemplo.png "Article One of the Universal Declaration of Human Rights, in Esperanto, in Tengwar.")

See [ekzemplo.tex](/ekzemplo.tex) for the code to the above example.
