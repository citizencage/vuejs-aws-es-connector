<template>
    <div>
        <div v-if="paging">
            <nav aria-label="search-pagination">
                <ul class="pagination justify-content-center">
                    <li class="page-item disabled">
                        <a class="page-link" href="#" tabindex="-1" aria-disabled="true">Previous</a>
                    </li>
                    <li class="page-item"><a class="page-link" href="#">1</a></li>
                    <li class="page-item"><a class="page-link" href="#">2</a></li>
                    <li class="page-item"><a class="page-link" href="#">3</a></li>
                    <li class="page-item">
                        <a class="page-link" href="#">Next</a>
                    </li>
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
            resultsTotal: {
                type: Number,
                default: 0
            },
            perPage: {
                type: Number,
                default: 20
            },
            currentOffset: {
                type: Number,
                default: 0
            }
        },
        data() {
            return {
                numberOfLinks: 2, // Number of "digit" links to show before/after the currently viewed page
                currentPage: 0, // The current page being viewed
                paging: false,
                prev: [],
                next: [],
                pageItems: []
            }
        },
        mounted() {
            EventBus.$on('initPagination', () => {
                this.initPagination();
            });
        },
        methods: {
            initPagination() {
                if (this.resultsTotal > 0 && (this.resultsTotal !== this.perPage)) {
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
                            ['number']: (this.currentPage === 1) ? 2 : (this.currentPage * this.perPage) - this.perPage
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
                console.log('number of pages', number_of_pages);
                this.paging = true;
            }
        }
    }
</script>