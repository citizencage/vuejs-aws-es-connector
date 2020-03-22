<template>
    <div>
        <div v-if="paging">
            <nav aria-label="search-pagination">
                <ul class="pagination" :class="setAlignment">

                    <li class="page-item" :class="[ prev.length > 0 ? '' : 'disabled' ]"><a href="javascript:void(0)" @click="updatePage(prev[0].number, prev[0].offset)" class="page-link" :aria-disabled="[ prev.length > 0 ? '' : 'true' ]">Previous</a></li>

                    <li :aria-current="[ item.selected ? 'page' : '' ]" class="page-item" :class="[ item.selected ? 'active' : '' ]" v-for="item in pageItems">
                        <a href="javascript:void(0)" @click="updatePage(item.number, item.offset)" class="page-link">{{ item.number }}<span v-if="item.selected" class="sr-only">(current)</span></a>
                    </li>

                    <li class="page-item" :class="[ next.length > 0 ? '' : 'disabled' ]"><a href="javascript:void(0)" @click="updatePage(next[0].number, next[0].offset)" class="page-link" :aria-disabled="[ next.length > 0 ? '' : 'true' ]">Next</a></li>

                </ul>
            </nav>
        </div>
    </div>
</template>

<script>
    import {EventBus} from '../../common';

    export default {
        name: 'Pagination',

        props: {
            perPage: {
                type: Number,
                default: 20
            },
            numberOfLinks: {
                type: Number,
                default: 3 // Number of "digit" links to show before/after the currently viewed page
            },
            alignment: {
                type: String,
                default: 'center' // left, right, center
            }
        },
        data() {
            return {
                currentPage: 0, // The current page being viewed
                currentOffset: 0,
                resultsTotal: 0,
                paging: false,
                prev: [],
                next: [],
                pageItems: []
            }
        },
        mounted() {
            EventBus.$on('initPagination', (offset, total) => {
                this.initPagination(offset, total);
            });
        },
        computed: {
          setAlignment() {
              let alignment_string;
              switch (this.alignment) {
                  case 'left' :
                      alignment_string = 'justify-content-start';
                      break;
                  case 'center' :
                      alignment_string = 'justify-content-center';
                      break;
                  case 'right' :
                      alignment_string = 'justify-content-end';
                      break;
                  default :
                      alignment_string = 'justify-content-center'
              }
              return alignment_string;
          }
        },
        methods: {
            updatePage(number, offset) {
              this.currentPage = number;
              this.currentOffset = offset;
              this.$emit('updatePage', this.currentPage, this.currentOffset);
            },
            initPagination(offset, total) {
                this.resultsTotal = total;
                this.currentOffset = offset;
                if (this.resultsTotal > 1 && (this.resultsTotal !== this.perPage)) {
                    this.buildPagination();
                } else {
                    // reset pagination (no need to display it)
                    this.prev = [];
                    this.next = [];
                    this.pageItems = [];
                    this.paging = false;
                }
            },
            buildPagination() {
                this.prev = [];
                this.next = [];
                this.pageItems = [];
                let number_of_pages, uri_page_number, start, end, i, loop;

                number_of_pages = Math.ceil(this.resultsTotal / this.perPage);
                this.currentPage = this.currentOffset;

                // Is the page number beyond the result range?
                // If so we show the last page
                if (this.currentPage > this.resultsTotal) {
                    this.currentPage = (number_of_pages - 1) * this.perPage;
                }

                uri_page_number = this.currentPage;
                this.currentPage = Math.floor((this.currentPage / this.perPage) + 1);

                // Calculate the start and end numbers. These determine which number to start and end the digit links with
                start = ((this.currentPage - this.numberOfLinks) > 0) ? this.currentPage - (this.numberOfLinks - 1) : 1;
                end = ((this.currentPage + this.numberOfLinks) < number_of_pages) ? this.currentPage + this.numberOfLinks : number_of_pages;

                // Render the "previous" link
                if (this.currentPage !== 1) {
                    i = uri_page_number - this.perPage;
                    this.prev.push(
                        {
                            ['offset']: i,
                            ['number']: this.currentPage - 1
                        }
                    );
                }

                // Render the "next" link
                if (this.currentPage < number_of_pages) {
                    this.next.push(
                        {
                            ['offset']: this.currentPage * this.perPage,
                            ['number']: this.currentPage + 1
                        }
                    );
                }

                // Write the digit links
                for (loop = start - 1; loop <= end; loop++) {
                    i = (loop * this.perPage) - this.perPage;
                    if (i >= 0) {
                        this.pageItems.push(
                            {
                                ['number']: loop,
                                ['selected']: (this.currentPage === loop),
                                ['offset']: i,
                            }
                        );
                    }
                }

                this.paging = true;
            }
        }
    }
</script>