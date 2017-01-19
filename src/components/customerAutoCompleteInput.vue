<!-- customerAutoCompleteInput.vue -->
<template>
    <div 
        class="customer-autocomplete-input" 
        style="width: 200px;"
        id="customerAutoCompleteInput"
    >
        <input 
            class="form-control input-sm" 
            :value="value"
            placeholder="请输入客户名称或公司"
            style="width: 100%;"
            @input="handleChange"
            @keydown.up="highlight(highlightedIndex - 1)"
            @keydown.down="highlight(highlightedIndex + 1)"
            @keydown.enter.stop="select(highlightedIndex)"
        >
        </input>
        <ul 
            v-show="suggestionVisible" 
            class="customer-autocomplete-suggestions" 
            id="customerAutoCompleteSuggestions" 
            transition="zoom-in-top"
        >
            <li 
                v-for="item of suggestions" 
                @click="select($index)"
                :class="{'highlighted': highlightedIndex === $index}"
            >
                <div class="name">{{{item.name | keywordFilter value}}}</div>
                <span class="company">{{{item.company | keywordFilter value}}}</span>
            </li>
        </ul>
    </div>
</template>

<script>
import { callback } from '../store'
import _ from 'lodash'
import $ from 'jquery'

export default {
    name: 'customerAutoCompleteInput',
    data() {
        return {
            value: '',
            suggestions: [],
            suggestionVisible: false,
            highlightedIndex: -1,
            inputElement: null,
        };
    },
    ready() {
        this.inputElement = document.getElementById('customerAutoCompleteInput');
        $(document).bind("click", this.documentOnClick);
    },
    beforeDestroy() {
        $(document).unbind("click", this.documentOnClick);
    },
    filters: {
        keywordFilter(content, keyword) {
            var index = content.indexOf(keyword);
            if (keyword && index >= 0) {
                return content.substring(0, index) + "<font color='red'>" + content.substring(index, index + keyword.length) + "</font>" + content.substring(index + keyword.length);
            }
            return content;
        }
    },
    methods: {
        documentOnClick(e) {
            if (this.suggestionVisible && !this.inputElement.contains(e.target)) {
                this.handleBlur();
            }
        },
        handleChange: _.debounce(function (event) {
            this.value = event.target.value;
            this.$emit('input', {
                type: 'text',
                value: this.value,
            });
            this.showSuggestions(this.value);
        }, 500),
        handleBlur() {
            this.hideSuggestions();
        },
        select(index) {
            if (this.suggestions && this.suggestions[index]) {
                this.$emit('input', {
                    type: 'obj',
                    value: this.suggestions[index],
                });
                this.$nextTick(() => {
                    this.value = this.suggestions[index].name + '/' + this.suggestions[index].company;
                    this.hideSuggestions();
                });
            }
        },
        hideSuggestions() {
            this.suggestionVisible = false;
            this.suggestions = [];
        },
        showSuggestions(value) {
            this.fetchSuggestions(value, (suggestions) => {
                if (Array.isArray(suggestions) && suggestions.length > 0) {
                    this.suggestionVisible = true;
                    this.highlightedIndex = -1;
                    this.suggestions = suggestions;
                } else {
                    this.hideSuggestions();
                }
            });
        },
        fetchSuggestions(value, cb) {
            var url = '/api/v2/admin/customers/quick-search?limit=15&keyword=' + value;
            this.$http.get(url)
            .then((response) => {
                if (!response.data.result || response.data.result === 0) {
                    var results = response.data.customers;
                    cb(results);
                } else {
                    callback.success(response.data);
                }
            },(response) => {
                callback.error(response);
            });
        },
        highlight(index) {
            if (!this.suggestionVisible) { return; }
            if (index < 0) {
                index = 0;
            } else if (index >= this.suggestions.length) {
                index = this.suggestions.length - 1;
            }

            var elSuggestions = document.getElementById('customerAutoCompleteSuggestions');
            var elSelect = elSuggestions.children[index];
            var scrollTop = elSuggestions.scrollTop;
            var offsetTop = elSelect.offsetTop;

            if (offsetTop + elSelect.scrollHeight > (scrollTop + elSuggestions.clientHeight)) {
                elSuggestions.scrollTop += elSelect.scrollHeight;
            }
            if (offsetTop < scrollTop) {
                elSuggestions.scrollTop -= elSelect.scrollHeight;
            }

            this.highlightedIndex = index;
        }
    }
}

</script>

<style scoped>
.customer-autocomplete-input {
    position: relative;
    display: inline-block;
    text-align: left;
}

.customer-autocomplete-suggestions {
    position: absolute;
    left: 0;
    top: 110%;
    margin: 5px 0 0;
    background-color: #fff;
    border: 1px solid #d3dce6;
    width: 100%;
    padding: 6px 0;
    z-index: 10;
    border-radius: 2px;
    max-height: 280px;
    box-sizing: border-box;
    overflow: auto;
    box-shadow: 0 0 6px 0 rgba(0,0,0,.04),0 2px 4px 0 rgba(0,0,0,.12);
}

.customer-autocomplete-suggestions li {
    list-style: none;
    line-height: normal;
    padding: 7px;
    margin: 0;
    cursor: pointer;
    color: #475669;
    font-size: 14px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.customer-autocomplete-suggestions li:hover {
    background-color: #e5e9f2;
}

.customer-autocomplete-suggestions li.highlighted {
    background-color: #20a0ff;
    color: #fff;
}

.customer-autocomplete-suggestions li:active {
    background-color: #0082e6;
}

.customer-autocomplete-suggestions li .name {
    text-overflow: ellipsis;
    overflow: hidden;
}

.customer-autocomplete-suggestions li .company {
    font-size: 12px;
    color: #b4b4b4;
}

.customer-autocomplete-suggestions li .highlighted .company {
    color: #ddd;
}

.zoom-in-top-transition {
    opacity: 1;
    transform: scaleY(1);
    transition: transform .3s cubic-bezier(.23,1,.32,1) .1s,opacity .3s cubic-bezier(.23,1,.32,1) .1s;
    transform-origin: center top;
}

.zoom-in-top-enter, .zoom-in-top-leave {
    opacity:0;
    transform: scaleY(0);
}
</style>