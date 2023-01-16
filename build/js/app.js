// deno-fmt-ignore-file
// deno-lint-ignore-file
// This code was bundled using `deno bundle` and it's not recommended to edit it manually

function init() {
    const button = document.querySelector('header button');
    const menu = document.querySelector('header nav');
    if (button && menu) {
        button.addEventListener('click', ()=>{
            menu.classList.toggle('open');
        });
    }
}
const selfClosingTags = [
    'br',
    'hr',
    'img',
    'input',
    'link',
    'meta'
];
class StyleDeclaration {
    _properties = {};
    get cssText() {
        return Object.keys(this._properties).sort((x, y)=>x.localeCompare(y)
        ).map((x)=>`${x}: ${this._properties[x]};`
        ).join(' ');
    }
    get length() {
        return Object.keys(this._properties).length;
    }
    getPropertyValue(name) {
        return this._properties[name];
    }
    removeProperty(name) {
        delete this._properties[name];
    }
    setProperty(name, value) {
        this._properties[name] = value;
    }
}
class TokenList {
    _tokens = [];
    get length() {
        return this._tokens.length;
    }
    get value() {
        return this._tokens.join(' ');
    }
    item(index) {
        return this._tokens[index];
    }
    contains(token) {
        return this._tokens.includes(token);
    }
    add(token) {
        if (!this._tokens.includes(token)) {
            this._tokens.push(token);
        }
    }
    remove(token) {
        const index = this._tokens.indexOf(token);
        if (index > -1) {
            this._tokens.splice(index, 1);
        }
    }
    replace(token1, token2) {
        const index = this._tokens.indexOf(token1);
        if (index > -1) {
            this._tokens[index] = token2;
        }
    }
    toggle(token) {
        if (this._tokens.includes(token)) {
            this.remove(token);
        } else {
            this.add(token);
        }
    }
}
function element(tagName, options = {}) {
    return new Element(tagName, options);
}
class Element {
    tagName;
    children;
    style;
    classList;
    attributes;
    constructor(tagName, options = {}){
        this.tagName = tagName;
        this.children = [];
        this.style = new StyleDeclaration();
        this.classList = new TokenList();
        this.attributes = {};
        for (const [key, value] of Object.entries(options)){
            switch(key){
                case 'tagName':
                case 'classList':
                    break;
                case 'children':
                    if (Array.isArray(options.children)) {
                        for (const child of options.children){
                            if (child instanceof Element || typeof child === 'string') {
                                this.children.push(child);
                            }
                        }
                    }
                    break;
                case 'innerHTML':
                    if (typeof options.innerHTML === 'string') {
                        this.innerHTML = options.innerHTML;
                    }
                    break;
                case 'style':
                    for (const [key1, value1] of Object.entries(options.style)){
                        if (typeof value1 === 'string') {
                            this.style.setProperty(key1, value1);
                        }
                    }
                    break;
                case 'class':
                case 'className':
                    if (typeof value === 'string') {
                        for (const className of value.split(' ')){
                            this.classList.add(className);
                        }
                    } else if (Array.isArray(value)) {
                        for (const className of value){
                            this.classList.add(className);
                        }
                    }
                    break;
                default:
                    if (typeof value === 'string' || typeof value === 'boolean') {
                        this.attributes[key] = value;
                    }
            }
        }
    }
    get className() {
        return this.classList.value;
    }
    get id() {
        return this.attributes.id?.toString();
    }
    get title() {
        return this.attributes.title?.toString();
    }
    get innerHTML() {
        return this.children.map((x)=>x.toString()
        ).join('');
    }
    get openingTag() {
        let result = `<${this.tagName}`;
        if (this.className.length > 0) {
            result += ` class="${this.className}"`;
        }
        if (this.style.cssText.length > 0) {
            result += ` style="${this.style.cssText}"`;
        }
        for (const [key, value] of Object.entries(this.attributes)){
            result += typeof value === 'boolean' ? ` ${key}` : ` ${key}="${value.replace(/"/g, '\'').replace(/\n/g, '').trim()}"`;
        }
        result += '>';
        return result;
    }
    get closingTag() {
        return `</${this.tagName}>`;
    }
    get outerHTML() {
        if (this.innerHTML.length > 0) {
            return this.openingTag + this.innerHTML + this.closingTag;
        }
        if (selfClosingTags.includes(this.tagName)) {
            return this.openingTag;
        }
        return this.openingTag + this.closingTag;
    }
    set innerHTML(innerHTML) {
        this.children = [
            innerHTML
        ];
    }
    getAttribute(key) {
        return this.attributes[key];
    }
    setAttribute(key, value) {
        this.attributes[key] = value;
    }
    toString() {
        return this.tagName === 'html' ? '<!doctype html>' + this.outerHTML : this.outerHTML;
    }
}
const isAuthor = (data)=>'forename' in data
;
const isText = (data)=>'blocks' in data
;
const isTextStub = (data)=>'breadcrumb' in data
;
const isBlock = (data)=>'content' in data
;
const link = (data)=>{
    if (isAuthor(data)) {
        return `<a href="${url(data)}">${fullname(data)}</a>`;
    }
    if (isText(data) || isTextStub(data)) {
        return `<a href="${url(data)}">${title(data)}</a>`;
    }
    const id = data.author ? data.id.replace(/^[a-zA-Z]+\./, `${data.author}.`) : data.id;
    return `<a href="${url(data)}">${id}</a>`;
};
const url = (data)=>{
    return isBlock(data) ? `/texts/${data.id.toLowerCase().replace(/\.([^\.]*)$/, '#$1').replace(/\./g, '/')}` : `/texts/${data.id.toLowerCase().replace(/\./g, '/')}`;
};
const fullname = (author3, search1)=>{
    const fullname1 = author3.title ? `${author3.title} [${author3.forename} ${author3.surname}]` : `${author3.forename} ${author3.surname}`;
    return search1 && search1.length > 0 ? fullname1.replace(regexp(search1), '<mark>$1</mark>') : fullname1;
};
const regexp = (search2)=>{
    return new RegExp(`\\b(${search2})`, 'i');
};
const title = (text2)=>{
    return `${text2.title} (${text2.published.map((x)=>x.toString(10)
    ).join(', ')})`;
};
const author = (author2, search3)=>{
    return element('a', {
        class: 'author',
        href: url(author2),
        children: [
            element('h6', {
                innerHTML: `${fullname(author2, search3)} (${author2.birth}-${author2.death})`
            }),
            element('div', {
                class: 'details',
                children: [
                    element('div', {
                        innerHTML: `Nationality: ${author2.nationality}`
                    }),
                    element('div', {
                        innerHTML: `Sex: ${author2.sex}`
                    }),
                    element('div', {
                        innerHTML: `Texts in library: ${author2.texts.filter((x)=>x.imported
                        ).length} / ${author2.texts.length}`
                    })
                ]
            })
        ]
    });
};
const __default = (authors1, search4, order = 'published')=>{
    if (search4 && search4.length > 0) {
        authors1 = authors1.filter((author1)=>fullname(author1).match(regexp(search4))
        );
    }
    authors1.sort((a, b)=>a.id.localeCompare(b.id, 'en')
    );
    switch(order){
        case 'published':
            authors1.sort((a, b)=>a.published - b.published
            );
            break;
        case 'birth':
            authors1.sort((a, b)=>a.birth - b.birth
            );
            break;
    }
    return element('div', {
        id: 'library',
        class: 'library',
        children: authors1.length > 0 ? authors1.map((x)=>author(x, search4)
        ) : [
            element('p', {
                innerHTML: 'No matching authors.'
            })
        ]
    });
};
const authors = async ()=>{
    return JSON.parse(await fetchData('authors')).texts;
};
const author1 = async (id)=>{
    const sanitizedId = id.toLowerCase().replaceAll('.', '');
    try {
        const response = JSON.parse(await fetchData(`html/${sanitizedId}`));
        if (response.error) {
            return undefined;
        }
        return response;
    } catch  {
        return undefined;
    }
};
const text = async (id, type = 'html')=>{
    try {
        const result = JSON.parse(await fetchData(`${type}/${id.toLowerCase().replaceAll('.', '/')}`));
        if (result.error) {
            return undefined;
        }
        return result;
    } catch  {
        return undefined;
    }
};
const analysis = async (id)=>{
    try {
        const result = JSON.parse(await fetchData(`analysis/${id.toLowerCase().replaceAll('.', '/')}`));
        if (result.error) {
            return undefined;
        }
        return result;
    } catch  {
        return undefined;
    }
};
const fetchData = async (path)=>{
    const request = new Request(`${dataUrl}/${path}`);
    const response = await fetch(request);
    return await response.text();
};
const dataUrl = 'https://ept.deno.dev';
async function init1() {
    const searchInput = document.querySelector('[data-action="filter-authors"]');
    const orderSelect = document.querySelector('[data-action="order-authors"]');
    const libraryDiv = document.getElementById('library');
    if (searchInput && orderSelect && libraryDiv) {
        const authors2 = await authors();
        function update() {
            libraryDiv.innerHTML = __default(authors2, searchInput.value, orderSelect.value).innerHTML;
        }
        searchInput.addEventListener('keyup', update);
        orderSelect.addEventListener('change', update);
        update();
    }
}
function init2() {
    const selectMenu = document.querySelector('select.submenu');
    if (selectMenu) {
        selectMenu.addEventListener('change', ()=>{
            window.location.pathname = selectMenu.value;
        });
        selectMenu.removeAttribute('disabled');
    }
}
const block = (block1)=>{
    return element('div', {
        class: 'block',
        id: block1.id.split('.').pop(),
        children: [
            element('div', {
                class: 'id',
                innerHTML: link(block1)
            }),
            content(block1)
        ]
    });
};
const content = (block2)=>{
    const innerHTML = block2.speaker ? `<i>${block2.speaker}</i>. ${block2.content}` : block2.content;
    return element('div', {
        class: 'content',
        innerHTML
    });
};
const __default1 = (blocks)=>{
    return element('div', {
        class: 'section-content blocks',
        children: blocks.map(block)
    });
};
const tocEntry = (textStub)=>{
    return element('li', {
        innerHTML: textStub.imported ? link(textStub) : title(textStub)
    });
};
const __default2 = (text3)=>{
    return element('ul', {
        class: 'section-content toc',
        children: text3.texts.map(tocEntry)
    });
};
const search = (id)=>{
    return element('div', {
        class: 'section-content search',
        children: [
            form(id),
            resultsPlaceholder
        ]
    });
};
const results = (result)=>{
    if (!result) {
        return element('div', {
            class: 'results',
            innerHTML: 'No paragraphs matched your search criteria.'
        });
    }
    return element('div', {
        class: 'results',
        children: [
            displayResult(result)
        ]
    });
};
const form = (id)=>{
    return element('form', {
        class: 'search-form',
        children: [
            element('input', {
                type: 'hidden',
                name: 'id',
                value: id
            }),
            query(1, 'For paragraphs that contain:'),
            query(2, 'But not:'),
            element('div', {
                class: 'group',
                children: [
                    element('label', {
                        class: 'label',
                        innerHTML: 'Options:'
                    }),
                    element('div', {
                        class: 'inputs checkboxes',
                        children: [
                            element('label', {
                                innerHTML: '<input type="checkbox" name="ignorePunctuation" checked> Ignore Punctuation'
                            }),
                            element('label', {
                                innerHTML: '<input type="checkbox" name="wholeWords" checked> Match Whole Words'
                            }),
                            element('label', {
                                innerHTML: '<input type="checkbox" name="variantSpellings" checked> Match Variant Spellings'
                            })
                        ]
                    })
                ]
            }),
            element('div', {
                class: 'group buttons',
                children: [
                    element('button', {
                        type: 'submit',
                        innerHTML: 'Search'
                    })
                ]
            })
        ]
    });
};
const query = (id, label)=>{
    return element('div', {
        class: 'group',
        children: [
            element('label', {
                class: 'label',
                for: `query${id}1`,
                innerHTML: label
            }),
            element('div', {
                class: 'inputs',
                children: [
                    element('input', {
                        type: 'text',
                        name: `query${id}1`,
                        id: `query${id}1`,
                        'aria-label': `Query ${id} first term`,
                        required: id === 1 ? 'required' : undefined
                    }),
                    element('select', {
                        name: `query${id}op`,
                        'aria-label': `Query ${id} operator`,
                        children: [
                            element('option', {
                                value: 'and',
                                innerHTML: 'AND'
                            }),
                            element('option', {
                                value: 'or',
                                innerHTML: 'OR'
                            })
                        ]
                    }),
                    element('input', {
                        type: 'text',
                        name: `query${id}2`,
                        'aria-label': `Query ${id} second term`
                    })
                ]
            })
        ]
    });
};
const resultsPlaceholder = element('div', {
    class: 'results hidden'
});
const displayResult = (result)=>{
    const children = [
        element('h4', {
            class: 'title',
            innerHTML: result.title
        }),
        element('p', {
            class: 'total',
            innerHTML: `${result.total} matching paragraphs`,
            onclick: 'event.currentTarget.nextElementSibling.classList.toggle(\'active\')'
        })
    ];
    if (result.blocks.length > 0) {
        children.push(element('div', {
            class: 'results',
            children: [
                __default1(result.blocks)
            ]
        }));
    }
    if (result.results.length > 0) {
        children.push(element('div', {
            class: 'results',
            children: result.results.map(displayResult)
        }));
    }
    return element('div', {
        class: 'result',
        children
    });
};
const author2 = (author11)=>{
    return element('div', {
        class: 'section-content about',
        children: [
            element('h2', {
                innerHTML: `${fullname(author11)} (${author11.birth}-${author11.death})`
            }),
            element('h4', {
                innerHTML: `${author11.nationality}, ${author11.sex}`
            }), 
        ]
    });
};
const text1 = (text11)=>{
    const children = [
        element('p', {
            innerHTML: text11.sourceDesc
        }),
        element('h4', {
            innerHTML: 'First published'
        }),
        element('p', {
            innerHTML: text11.published.map((x)=>x.toString(10)
            ).join(', ')
        }),
        element('h4', {
            innerHTML: 'Copytext'
        }),
        element('p', {
            innerHTML: text11.copytext.map((x)=>x.toString(10)
            ).join(', ')
        })
    ];
    if (text11.sourceUrl) {
        children.push(element('h4', {
            innerHTML: 'Source'
        }));
        children.push(element('p', {
            children: [
                element('a', {
                    href: text11.sourceUrl,
                    innerHTML: text11.sourceUrl
                })
            ]
        }));
    }
    return element('div', {
        class: 'section-content about',
        children
    });
};
const summary = (analysis1)=>{
    const isAuthor1 = analysis1.id.split('.').length === 1;
    const titleText = isAuthor1 ? 'The collected works of this author contain:' : 'This text contains:';
    return element('div', {
        class: 'section-content usage',
        children: [
            warning,
            element('p', {
                innerHTML: titleText
            }),
            element('ul', {
                children: [
                    element('li', {
                        innerHTML: `${analysis1.wordCount} words and ${analysis1.lemmaWordCount} lexemes`
                    }),
                    element('li', {
                        innerHTML: `${analysis1.names.length} references to named people (totalling ${analysis1.nameWordCount} words)`
                    }),
                    element('li', {
                        innerHTML: `${analysis1.citations.length} citations (totalling ${analysis1.citationWordCount} words)`
                    }),
                    element('li', {
                        innerHTML: `${analysis1.foreignText.length} instances of foreign text (totalling ${analysis1.foreignWordCount} words)`
                    })
                ]
            })
        ]
    });
};
const names = (analysis2)=>{
    return element('div', {
        class: 'section-content usage',
        children: [
            warning,
            analysis2.names.length > 0 ? element('ul', {
                children: analysis2.names.map(item)
            }) : element('p', {
                innerHTML: 'No named people.'
            })
        ]
    });
};
const citations = (analysis3)=>{
    return element('div', {
        class: 'section-content usage',
        children: [
            warning,
            analysis3.citations.length > 0 ? element('ul', {
                children: analysis3.citations.map(item)
            }) : element('p', {
                innerHTML: 'No citations.'
            })
        ]
    });
};
const foreignText = (analysis4)=>{
    return element('div', {
        class: 'section-content usage',
        children: [
            warning,
            analysis4.foreignText.length > 0 ? element('ul', {
                children: analysis4.foreignText.map(item)
            }) : element('p', {
                innerHTML: 'No foreign text.'
            })
        ]
    });
};
const lemmas = (analysis5)=>{
    return element('div', {
        class: 'section-content usage',
        children: [
            warning,
            element('table', {
                children: [
                    element('thead', {
                        children: [
                            element('th', {
                                innerHTML: 'Lemma'
                            }),
                            element('th', {
                                innerHTML: 'Raw frequency'
                            }),
                            element('th', {
                                innerHTML: 'TF-IDF'
                            })
                        ]
                    }),
                    element('tbody', {
                        children: analysis5.lemmas.map(lemmaRow)
                    })
                ]
            })
        ]
    });
};
const warning = element('p', {
    class: 'warning',
    innerHTML: 'These data are provisional. Their accuracy depends on software that is still being developed, and manual markup that is still being inputted and checked.'
});
const item = (innerHTML)=>{
    return element('li', {
        innerHTML
    });
};
const lemmaRow = (lemma)=>{
    return element('tr', {
        children: [
            element('td', {
                innerHTML: lemma.label
            }),
            element('td', {
                innerHTML: lemma.frequency.toString(10)
            }),
            element('td', {
                innerHTML: lemma.relativeTfIdf.toString(10).slice(0, 10)
            })
        ]
    });
};
const textContent = (text2, analysis6, section1)=>{
    switch(section1){
        case 'title':
            return __default1(text2.blocks.slice(0, 1));
        case 'content':
            return text2.texts.length ? __default2(text2) : __default1(text2.blocks.slice(1));
        case 'search':
            return search(text2.id);
        case 'summary':
            return summary(analysis6);
        case 'names':
            return names(analysis6);
        case 'citations':
            return citations(analysis6);
        case 'foreign':
            return foreignText(analysis6);
        case 'lemmas':
            return lemmas(analysis6);
        case 'about':
            return text1(text2);
    }
};
const authorContent = (author21, analysis7, section2)=>{
    switch(section2){
        case 'about':
            return author2(author21);
        case 'works':
            return __default2(author21);
        case 'search':
            return search(author21.id);
        case 'summary':
            return summary(analysis7);
        case 'names':
            return names(analysis7);
        case 'citations':
            return citations(analysis7);
        case 'foreign':
            return foreignText(analysis7);
        case 'lemmas':
            return lemmas(analysis7);
    }
};
function init3() {
    const searchForm = document.querySelector('.search-form');
    async function search5(event) {
        event.preventDefault();
        const evaluableInputs = Array.from(searchForm.querySelectorAll('input[type="text"], input[type="hidden"], select'));
        const checkableInputs = Array.from(searchForm.querySelectorAll('input[type="checkbox"]'));
        const fields = [];
        for (const field of evaluableInputs){
            fields.push(`${encodeURIComponent(field.name)}=${encodeURIComponent(field.value)}`);
        }
        for (const field1 of checkableInputs){
            fields.push(`${encodeURIComponent(field1.name)}=${field1.checked ? 'on' : 'off'}`);
        }
        const query1 = fields.join('&');
        const response = await fetch('/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: query1
        });
        if (response.ok) {
            const json = await response.json();
            const resultsDiv = searchForm.nextElementSibling;
            resultsDiv.innerHTML = results(json[0]).innerHTML;
            resultsDiv.classList.remove('hidden');
            resultsDiv.querySelector('.results').classList.add('active');
        }
    }
    if (searchForm) {
        searchForm.addEventListener('submit', search5);
    }
}
async function init4() {
    const authorMenus = Array.from(document.querySelectorAll('.section-menu[data-author]'));
    const textMenus = Array.from(document.querySelectorAll('.section-menu[data-text]'));
    if (authorMenus.length > 0) {
        const author4 = await author1(authorMenus[0].dataset.author);
        const analysis8 = await analysis(authorMenus[0].dataset.author);
        authorMenus.forEach((select)=>{
            select.addEventListener('change', ()=>{
                select.nextElementSibling.outerHTML = authorContent(author4, analysis8, select.value).outerHTML;
                init3();
            });
            select.removeAttribute('disabled');
        });
    }
    if (textMenus.length > 0) {
        const text4 = await text(textMenus[0].dataset.text);
        const analysis10 = await analysis(textMenus[0].dataset.text);
        textMenus.forEach((select)=>{
            select.addEventListener('change', ()=>{
                select.nextElementSibling.outerHTML = textContent(text4, analysis10, select.value).outerHTML;
                init3();
            });
            select.removeAttribute('disabled');
        });
    }
}
const emplTitles = [
    'Of the Delicacy of Taste and Passion',
    'Of the Liberty of the Press',
    'That Politics may be reduced to a Science',
    'Of the First Principles of Government',
    'Of the Origin of Government',
    'Of the Independency of Parliament',
    'Whether the British Government inclines more to Absolute Monarchy, or to a Republic',
    'Of Parties in General',
    'Of the Parties of Great Britain',
    'Of Superstition and Enthusiasm',
    'Of the Dignity or Meanness of Human Nature',
    'Of Civil Liberty',
    'Of Eloquence',
    'Of the Rise and Progress of the Arts and Sciences',
    'The Epicurean',
    'The Stoic',
    'The Platonist',
    'The Sceptic',
    'Of Polygamy and Divorces',
    'Of Simplicity and Refinement in Writing',
    'Of National Characters',
    'Of Tragedy',
    'Of the Standard of Taste'
];
const religionAuthorScores = [
    [
        'Norris',
        0.017574432
    ],
    [
        'Conway',
        0.013989768
    ],
    [
        'Hobbes',
        0.011956958
    ],
    [
        'Butler',
        0.010595097
    ],
    [
        'Astell',
        0.008094501
    ],
    [
        'Shaftesbury',
        0.00444186
    ],
    [
        'Berkeley',
        0.00299003
    ],
    [
        'Hutcheson',
        0.002979988
    ],
    [
        'Locke',
        0.002663299
    ],
    [
        'Mandeville',
        0.002406602
    ],
    [
        'Hume',
        0.001915714
    ],
    [
        'Drake',
        0.001104697
    ]
];
const religionTextScores = [
    [
        'Hume',
        'Natural History of Religion',
        0.018083265
    ],
    [
        'Norris',
        'Letters Concerning the Love of God, Between the Author of the Proposal to the Ladies and Mr. John Norris [Norris’s part]',
        0.017574432
    ],
    [
        'Astell',
        'Letters Concerning the Love of God, Between the Author of the Proposal to the Ladies and Mr. John Norris [Astell’s part]',
        0.015074935
    ],
    [
        'Butler',
        'The Analogy of Religion',
        0.014861825
    ],
    [
        'Conway',
        'The Principles of the Most Ancient and Modern Philosophy',
        0.013989768
    ],
    [
        'Hobbes',
        'Leviathan, or The Matter, Forme, & Power of a Common-Wealth Ecclesiastical and Civill',
        0.012737385
    ],
    [
        'Shaftesbury',
        'A Letter Concerning Enthusiasm',
        0.011595191
    ],
    [
        'Hume',
        'Dialogues concerning Natural Religion',
        0.009040334
    ],
    [
        'Astell',
        'A Serious Proposal to the Ladies, for the Advancement of their True and Greatest Interest',
        0.00808451
    ],
    [
        'Hume',
        'A Letter from a Gentleman to His Friend in Edinburgh',
        0.007410768
    ],
    [
        'Butler',
        'Fifteen Sermons Preached at the Rolls Chapel, to which are added Six Sermons Preached on Publick Occasions',
        0.006403047
    ],
    [
        'Shaftesbury',
        'Miscellaneous Reflections on the preceding Treatises, and other Critical Subjects',
        0.00559448
    ],
    [
        'Shaftesbury',
        'The Moralists, a Philosophical Rhapsody',
        0.005431316
    ],
    [
        'Astell',
        'Six Familiar Essays',
        0.005241352
    ],
    [
        'Berkeley',
        'Three Dialogues between Hylas and Philonous',
        0.004615883
    ],
    [
        'Shaftesbury',
        'An Inquiry Concerning Virtue or Merit',
        0.004565181
    ],
    [
        'Hume',
        'An Enquiry Concerning Human Understanding',
        0.00425667
    ],
    [
        'Hobbes',
        'Humane Nature; or, the Fundamental Elements of Policie',
        0.004236105
    ],
    [
        'Hume',
        'Essays, Withdrawn and Unpublished',
        0.004058938
    ],
    [
        'Hutcheson',
        'An Essay on the Nature and Conduct of the Passions and Affections, with Illustrations on the Moral Sense',
        0.003824468
    ],
    [
        'Berkeley',
        'A Treatise Concerning the Principles of Human Knowledge',
        0.003428729
    ],
    [
        'Astell',
        'Reflections Upon Marriage',
        0.003189793
    ],
    [
        'Mandeville',
        'The Fable of the Bees, Part 2',
        0.00288806
    ],
    [
        'Locke',
        'An Essay Concerning Human Understanding',
        0.002663299
    ],
    [
        'Hutcheson',
        'An Inquiry into the Original of Our Ideas of Beauty and Virtue',
        0.002111413
    ],
    [
        'Shaftesbury',
        'Sensus Communis: An Essay on the Freedom of Wit and Humour',
        0.001986492
    ],
    [
        'Mandeville',
        'The Fable of the Bees',
        0.001897793
    ],
    [
        'Hume',
        'Essays, Moral, Political, and Literary, Part 1',
        0.001729985
    ],
    [
        'Hume',
        'The History of England',
        0.001639577
    ],
    [
        'Shaftesbury',
        'A Notion of the Historical Draught or Tablature of the Judgment of Hercules',
        0.001496846
    ],
    [
        'Shaftesbury',
        'Soliloquy; or, Advice to an Author',
        0.001450248
    ],
    [
        'Drake',
        'Essay in Defense of the Female Sex',
        0.001104697
    ],
    [
        'Hume',
        'An Enquiry Concerning the Principles of Morals',
        0.000865179
    ],
    [
        'Hume',
        'A Treatise Concerning Human Nature',
        0.000719628
    ],
    [
        'Hume',
        'My Own Life',
        0.000677048
    ],
    [
        'Hume',
        'Abstract of the Treatise',
        0.00063012
    ],
    [
        'Hume',
        'Essays, Moral, Political, and Literary, Part 2',
        0.000558496
    ],
    [
        'Hume',
        'Dissertation on the Passions',
        0.000372821
    ],
    [
        'Shaftesbury',
        'Letter Concerning the Art, or Science of Design',
        0.000313873
    ],
    [
        'Berkeley',
        'Essay Towards a New Theory of Vision',
        0.000149321
    ]
];
const table = (titles, scores)=>{
    if (!scores) {
        return element('p', {
            innerHTML: 'Array index out of range.'
        });
    }
    const data = scores.map((score, index)=>({
            title: titles[index],
            score
        })
    ).sort((x, y)=>y.score - x.score
    );
    return element('table', {
        children: [
            element('thead', {
                children: [
                    element('tr', {
                        children: [
                            element('th', {
                                innerHTML: 'Comparison text'
                            }),
                            element('th', {
                                innerHTML: 'Similarity&nbsp;score'
                            })
                        ]
                    })
                ]
            }),
            element('tbody', {
                children: data.map((x)=>{
                    return element('tr', {
                        children: [
                            element('td', {
                                innerHTML: x.title
                            }),
                            element('td', {
                                innerHTML: (x.score * 10000).toString(10).slice(0, 6).padEnd(6, '0')
                            })
                        ]
                    });
                })
            })
        ]
    });
};
const emplTable = (id)=>{
    const scores = emplScores[id];
    return table(emplTitles, scores);
};
const dissertationTable = (id)=>{
    const scores = dissertationScores.map((x)=>x[id]
    );
    return table(emplTitles, scores);
};
table(religionAuthorScores.map((x)=>x[0]
), religionAuthorScores.map((x)=>x[1]
));
table(religionTextScores.map((x)=>`${x[0]}, <i>${x[1]}</i>`
), religionTextScores.map((x)=>x[2]
));
const emplScores = [
    [
        -1,
        0.000158711,
        0.000187015,
        0.000186675,
        0.000203503,
        0.000168862,
        0.000192877,
        0.000180398,
        0.000170192,
        0.000186219,
        0.000278702,
        0.000201981,
        0.000256948,
        0.000249509,
        0.000286248,
        0.0002676,
        0.00026203,
        0.000324266,
        0.000211737,
        0.00027576,
        0.000219561,
        0.00030412,
        0.000344483
    ],
    [
        0.000158711,
        -1,
        0.000378793,
        0.00044729,
        0.00040313,
        0.000412568,
        0.000509871,
        0.000315198,
        0.000544412,
        0.000283593,
        0.000184491,
        0.000435742,
        0.000218237,
        0.000331547,
        0.000165556,
        0.000186212,
        0.000156516,
        0.000184224,
        0.000266013,
        0.000207098,
        0.000261467,
        0.000189866,
        0.000180901
    ],
    [
        0.000187015,
        0.000378793,
        -1,
        0.000354317,
        0.000289989,
        0.000340024,
        0.000334479,
        0.00028982,
        0.000307153,
        0.000194653,
        0.000203742,
        0.000320118,
        0.000217163,
        0.000264459,
        0.000158476,
        0.000180431,
        0.000158537,
        0.000195684,
        0.000218897,
        0.000161829,
        0.000237711,
        0.000168023,
        0.000183714
    ],
    [
        0.000186675,
        0.00044729,
        0.000354317,
        -1,
        0.000365213,
        0.00050302,
        0.000536817,
        0.00033306,
        0.000380698,
        0.000215703,
        0.000219947,
        0.000364689,
        0.000217397,
        0.000279846,
        0.000152877,
        0.00018556,
        0.000161146,
        0.000220352,
        0.000202766,
        0.000173137,
        0.000252962,
        0.000174738,
        0.000216719
    ],
    [
        0.000203503,
        0.00040313,
        0.000289989,
        0.000365213,
        -1,
        0.000306818,
        0.000338417,
        0.000272785,
        0.000317604,
        0.000238657,
        0.000222708,
        0.000257632,
        0.000188049,
        0.000262116,
        0.000151437,
        0.000213092,
        0.000203094,
        0.000210613,
        0.000241939,
        0.000169837,
        0.000231277,
        0.000170165,
        0.000209062
    ],
    [
        0.000168862,
        0.000412568,
        0.000340024,
        0.00050302,
        0.000306818,
        -1,
        0.000454162,
        0.000257548,
        0.000387035,
        0.000194931,
        0.000193902,
        0.000285973,
        0.000207329,
        0.000245449,
        0.000157836,
        0.000176399,
        0.00015102,
        0.000193924,
        0.000203757,
        0.000184256,
        0.000200519,
        0.000164131,
        0.000183381
    ],
    [
        0.000192877,
        0.000509871,
        0.000334479,
        0.000536817,
        0.000338417,
        0.000454162,
        -1,
        0.000281081,
        0.000440858,
        0.000238879,
        0.000204466,
        0.000386084,
        0.000202366,
        0.000302305,
        0.000173819,
        0.000174465,
        0.00017432,
        0.000206033,
        0.000213723,
        0.000181053,
        0.000210594,
        0.00018218,
        0.000190201
    ],
    [
        0.000180398,
        0.000315198,
        0.00028982,
        0.00033306,
        0.000272785,
        0.000257548,
        0.000281081,
        -1,
        0.000360925,
        0.000290389,
        0.000224763,
        0.000256015,
        0.000206437,
        0.000246419,
        0.000162792,
        0.000169587,
        0.000168068,
        0.000188022,
        0.00021652,
        0.000149714,
        0.000236003,
        0.00017418,
        0.000196848
    ],
    [
        0.000170192,
        0.000544412,
        0.000307153,
        0.000380698,
        0.000317604,
        0.000387035,
        0.000440858,
        0.000360925,
        -1,
        0.000273703,
        0.00020504,
        0.000306671,
        0.000198523,
        0.000246547,
        0.000142064,
        0.000162402,
        0.000155807,
        0.000187762,
        0.000218207,
        0.00016204,
        0.000217461,
        0.00018465,
        0.000213761
    ],
    [
        0.000186219,
        0.000283593,
        0.000194653,
        0.000215703,
        0.000238657,
        0.000194931,
        0.000238879,
        0.000290389,
        0.000273703,
        -1,
        0.000200656,
        0.000195688,
        0.000170351,
        0.000209311,
        0.000204168,
        0.000196542,
        0.000208543,
        0.000205856,
        0.000204864,
        0.000174501,
        0.000231538,
        0.000193755,
        0.000200151
    ],
    [
        0.000278702,
        0.000184491,
        0.000203742,
        0.000219947,
        0.000222708,
        0.000193902,
        0.000204466,
        0.000224763,
        0.00020504,
        0.000200656,
        -1,
        0.000189572,
        0.000212174,
        0.000209309,
        0.000324024,
        0.000304163,
        0.000271473,
        0.00030877,
        0.000217132,
        0.000219978,
        0.000215817,
        0.00022641,
        0.000258707
    ],
    [
        0.000201981,
        0.000435742,
        0.000320118,
        0.000364689,
        0.000257632,
        0.000285973,
        0.000386084,
        0.000256015,
        0.000306671,
        0.000195688,
        0.000189572,
        -1,
        0.000265171,
        0.00032478,
        0.000171185,
        0.00017974,
        0.000209172,
        0.000185482,
        0.000210181,
        0.000190866,
        0.000244982,
        0.000165756,
        0.000191628
    ],
    [
        0.000256948,
        0.000218237,
        0.000217163,
        0.000217397,
        0.000188049,
        0.000207329,
        0.000202366,
        0.000206437,
        0.000198523,
        0.000170351,
        0.000212174,
        0.000265171,
        -1,
        0.000267151,
        0.000195101,
        0.000201114,
        0.000225434,
        0.000209839,
        0.000182813,
        0.000253487,
        0.000222061,
        0.000277978,
        0.000253334
    ],
    [
        0.000249509,
        0.000331547,
        0.000264459,
        0.000279846,
        0.000262116,
        0.000245449,
        0.000302305,
        0.000246419,
        0.000246547,
        0.000209311,
        0.000209309,
        0.00032478,
        0.000267151,
        -1,
        0.000196158,
        0.000207199,
        0.000220972,
        0.000205302,
        0.000228414,
        0.000229041,
        0.000256983,
        0.000196476,
        0.000225018
    ],
    [
        0.000286248,
        0.000165556,
        0.000158476,
        0.000152877,
        0.000151437,
        0.000157836,
        0.000173819,
        0.000162792,
        0.000142064,
        0.000204168,
        0.000324024,
        0.000171185,
        0.000195101,
        0.000196158,
        -1,
        0.000544822,
        0.000443924,
        0.000364022,
        0.000242269,
        0.000203199,
        0.000166372,
        0.000258417,
        0.000199083
    ],
    [
        0.0002676,
        0.000186212,
        0.000180431,
        0.00018556,
        0.000213092,
        0.000176399,
        0.000174465,
        0.000169587,
        0.000162402,
        0.000196542,
        0.000304163,
        0.00017974,
        0.000201114,
        0.000207199,
        0.000544822,
        -1,
        0.001027543,
        0.000328822,
        0.00023486,
        0.000179958,
        0.000182714,
        0.000266012,
        0.000214189
    ],
    [
        0.00026203,
        0.000156516,
        0.000158537,
        0.000161146,
        0.000203094,
        0.00015102,
        0.00017432,
        0.000168068,
        0.000155807,
        0.000208543,
        0.000271473,
        0.000209172,
        0.000225434,
        0.000220972,
        0.000443924,
        0.001027543,
        -1,
        0.000258017,
        0.000192372,
        0.000218774,
        0.000158388,
        0.000216527,
        0.000274566
    ],
    [
        0.000324266,
        0.000184224,
        0.000195684,
        0.000220352,
        0.000210613,
        0.000193924,
        0.000206033,
        0.000188022,
        0.000187762,
        0.000205856,
        0.00030877,
        0.000185482,
        0.000209839,
        0.000205302,
        0.000364022,
        0.000328822,
        0.000258017,
        -1,
        0.000210972,
        0.000230094,
        0.000209307,
        0.000267756,
        0.000267109
    ],
    [
        0.000211737,
        0.000266013,
        0.000218897,
        0.000202766,
        0.000241939,
        0.000203757,
        0.000213723,
        0.00021652,
        0.000218207,
        0.000204864,
        0.000217132,
        0.000210181,
        0.000182813,
        0.000228414,
        0.000242269,
        0.00023486,
        0.000192372,
        0.000210972,
        -1,
        0.000178345,
        0.000205798,
        0.000196512,
        0.000187845
    ],
    [
        0.00027576,
        0.000207098,
        0.000161829,
        0.000173137,
        0.000169837,
        0.000184256,
        0.000181053,
        0.000149714,
        0.00016204,
        0.000174501,
        0.000219978,
        0.000190866,
        0.000253487,
        0.000229041,
        0.000203199,
        0.000179958,
        0.000218774,
        0.000230094,
        0.000178345,
        -1,
        0.000194176,
        0.00023078,
        0.00031033
    ],
    [
        0.000219561,
        0.000261467,
        0.000237711,
        0.000252962,
        0.000231277,
        0.000200519,
        0.000210594,
        0.000236003,
        0.000217461,
        0.000231538,
        0.000215817,
        0.000244982,
        0.000222061,
        0.000256983,
        0.000166372,
        0.000182714,
        0.000158388,
        0.000209307,
        0.000205798,
        0.000194176,
        -1,
        0.000175993,
        0.00021216
    ],
    [
        0.00030412,
        0.000189866,
        0.000168023,
        0.000174738,
        0.000170165,
        0.000164131,
        0.00018218,
        0.00017418,
        0.00018465,
        0.000193755,
        0.00022641,
        0.000165756,
        0.000277978,
        0.000196476,
        0.000258417,
        0.000266012,
        0.000216527,
        0.000267756,
        0.000196512,
        0.00023078,
        0.000175993,
        -1,
        0.000241917
    ],
    [
        0.000344483,
        0.000180901,
        0.000183714,
        0.000216719,
        0.000209062,
        0.000183381,
        0.000190201,
        0.000196848,
        0.000213761,
        0.000200151,
        0.000258707,
        0.000191628,
        0.000253334,
        0.000225018,
        0.000199083,
        0.000214189,
        0.000274566,
        0.000267109,
        0.000187845,
        0.00031033,
        0.00021216,
        0.000241917,
        -1
    ]
];
const dissertationScores = [
    [
        0.000305073,
        0.00029507,
        0.000289262,
        0.000359033,
        0.000281077,
        0.000318686,
        0.000340124
    ],
    [
        0.00021495,
        0.000237439,
        0.000200596,
        0.000197599,
        0.000222487,
        0.000227103,
        0.000230999
    ],
    [
        0.000199154,
        0.000182015,
        0.000201601,
        0.000204522,
        0.00020807,
        0.000204264,
        0.00019584
    ],
    [
        0.000243772,
        0.000230464,
        0.000248768,
        0.000225507,
        0.000231924,
        0.000293038,
        0.000246077
    ],
    [
        0.000215617,
        0.000185289,
        0.000223331,
        0.000196931,
        0.000215739,
        0.000260773,
        0.000222912
    ],
    [
        0.000212446,
        0.000203728,
        0.0002176,
        0.000204672,
        0.000202484,
        0.000248734,
        0.000203373
    ],
    [
        0.000223593,
        0.000215596,
        0.000219943,
        0.000208617,
        0.000215892,
        0.000250123,
        0.00025125
    ],
    [
        0.000219333,
        0.00020187,
        0.000207538,
        0.000247262,
        0.000235774,
        0.000234609,
        0.000239604
    ],
    [
        0.000221294,
        0.000208706,
        0.000218623,
        0.000213301,
        0.00024237,
        0.00023768,
        0.000223891
    ],
    [
        0.000229268,
        0.00023561,
        0.000211806,
        0.000239961,
        0.000218462,
        0.000249185,
        0.000270883
    ],
    [
        0.000288315,
        0.000254381,
        0.0002911,
        0.000319655,
        0.000324528,
        0.000271774,
        0.000268292
    ],
    [
        0.00019113,
        0.000173647,
        0.000194559,
        0.000187235,
        0.000202262,
        0.000192837,
        0.000190901
    ],
    [
        0.000204551,
        0.000187201,
        0.000201302,
        0.000197371,
        0.000219764,
        0.00021808,
        0.00022131
    ],
    [
        0.000219571,
        0.000206573,
        0.000216767,
        0.000221727,
        0.000234219,
        0.000215415,
        0.000228558
    ],
    [
        0.000250046,
        0.000288199,
        0.000248321,
        0.000238137,
        0.000242953,
        0.000181319,
        0.000239919
    ],
    [
        0.00024155,
        0.00025015,
        0.000236685,
        0.000270324,
        0.000218525,
        0.000229603,
        0.000245372
    ],
    [
        0.000236124,
        0.000205015,
        0.00024342,
        0.000268623,
        0.00024072,
        0.000219425,
        0.000226159
    ],
    [
        0.00029771,
        0.000302896,
        0.000284881,
        0.000323419,
        0.000280709,
        0.000328459,
        0.00031296
    ],
    [
        0.000231505,
        0.000225226,
        0.000219013,
        0.000275534,
        0.000241293,
        0.000218192,
        0.000242294
    ],
    [
        0.000228583,
        0.000225946,
        0.000230176,
        0.000212439,
        0.000241007,
        0.000197721,
        0.000228876
    ],
    [
        0.000223908,
        0.000209644,
        0.000228373,
        0.000206607,
        0.000234084,
        0.000239066,
        0.000220863
    ],
    [
        0.000358464,
        0.000379302,
        0.000311666,
        0.000389094,
        0.000320963,
        0.000321126,
        0.000496763
    ],
    [
        0.000274714,
        0.00024125,
        0.000286349,
        0.00029922,
        0.000290463,
        0.000265269,
        0.000244544
    ]
];
function init5() {
    const emplSelect = document.querySelector('[data-table="empl-similarity"]');
    const dissertationSelect = document.querySelector('[data-table="dissertation-similarity"]');
    if (emplSelect && dissertationSelect) {
        const emplTableHTML = emplSelect.nextElementSibling;
        const dissertationTableHTML = dissertationSelect.nextElementSibling;
        emplSelect.addEventListener('change', ()=>{
            emplTableHTML.innerHTML = emplTable(parseInt(emplSelect.value)).innerHTML;
        });
        dissertationSelect.addEventListener('change', ()=>{
            dissertationTableHTML.innerHTML = dissertationTable(parseInt(dissertationSelect.value)).innerHTML;
        });
    }
}
init();
init1();
init2();
init4();
init3();
init5();
