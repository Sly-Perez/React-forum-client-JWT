import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const PaginationBox = ({currentPage, totalPages, changePage}) => {

  const [firstPage, setFirstPage] = useState(1);
  const [lastPage, setLastPage] = useState(totalPages);

  useEffect(()=>{
    
    setLastPage(totalPages);
    
  }, [currentPage, totalPages, changePage]);

  const goToPreviousPage = () =>{
    if((currentPage - 1) > 0){
      changePage(currentPage - 1);
    }
  }

  const goToNextPage = () =>{
    if((currentPage + 1) <= lastPage){
      changePage(currentPage + 1);
    }
  }

  const generatePages = () =>{
    let pages = [];

    //if there are more than 6 pages, we will display seven pages per pagination. Otherwise, we will display just the total of pages
    let totalPagesDisplayed = (totalPages > 6) ? 7 : totalPages;

    //if the current page is 1, we will display the first seven pages (e.g; [1] 2 3 4 5 6 7 >).
    //otherwise, we will display the previous and next three pages of the current page (e.g; < 1 . 3 4 5 [6] 7 8 9 . 99 >)
    
    // IMPORTANT MEASURES:
    // the loop of elements adds the three previous and next pages based on the current page. 
    // If total pages is greater than 6, when we get to the second or third page, the pagination shows less pages than 7 pages, because it can't render pages smaller than 1
    // we want to take the pages it can't render and add them to the pages displayed in the right.
    // for this, we will just show the first 7 pages until it gets to the 6th page
    /*
    (e.g; 
      instead of displaying (because the pages -1 and 0 cannot be rendered):
      < 1 [2] 3 4 5 >
      it will display the first seven pages:
      < 1 [2] 3 4 5 6 7 >
      < 1 2 [3] 4 5 6 7 >
      < 1 2 3 [4] 5 6 7 >
    )
    */
    let addend;
    
    if((currentPage - 4) <= firstPage){
      addend = 0;
    }
    /*
    // If total pages is greater than 6, when we get to the last or the page before the last, the pagination shows less pages than 7 pages, because it can't render pages greater than the last page
    // we want to take the pages it can't render and add them to the pages displayed in the left.
    // for this, we will just show the last 7 pages until it gets to a page that is, at least, 5 pages away from the last page
    /*
    (e.g; 
      instead of displaying (because the pages 13, 14 and 15 cannot be rendered):
      // < 1 . 9 10 11 [12] >
      it will display the last seven pages:
      < 1 . 6 7 8 9 10 11 [12] >
      < 1 . 6 7 8 9 10 [11] 12 >
      < 1 . 6 7 8 9 [10] 11 12 >
      < 1 . 6 7 [8] 9 10 11 12 >
    )
    */
    else if((currentPage + 4) >= lastPage){
      addend = -6;
    }
    /*
      Otherwise, there won't be any problems when trying to load the previous and next three pages. So, we keep the initial logic:
    */
    else{
      addend = -3;
    }

    //the first page will always appear: when the current page is 1, 2, 3, 4, 5 and for pages greater than 6
    //so, we'll always show it
    const firstPageElement = <Link key={firstPage} className={`WT-anchor pagination-item border-3 box-shadow-sm py-10 px-10 ${(currentPage === firstPage) ? "" : "f-black-color bg-white"}`} to="" onClick={()=>changePage(firstPage)}>
                                <span className="px-10">
                                    {firstPage}
                                </span>
                            </Link>;
    pages.push(firstPageElement);

    //if the current page is 6 or greater, we will display a dot to give the appearance of a great distance from the first page
    if(currentPage >= 6){
      const dotForDistanceElement = <label key={'firstPageDot'} className={`py-10 px-10`} >
                                      .
                                    </label>;
      pages.push(dotForDistanceElement);
    }

    for (let i = 0; i < totalPagesDisplayed; i++) {
      let page;

      // we add this validation to show the first seven pages. For that, we'll need to start from the firstPage
      // < [2] 3 4 5 6 7 8 >    WE CHANGE IT TO: < 1 [2] 3 4 5 6 7 >
      // and
      // < [3] 4 5 6 7 8 9 >  WE CHANGE IT TO: < 1 2 [3] 4 5 6 7 >
      if((currentPage - 4) <= firstPage){
        // 1 + 0 = 1
        // 1 + 1 = 2
        // 1 + 2 = 3
        // 1 + 3 = 4
        // 1 + 4 = 5
        // 1 + 5 = 6
        // 1 + 6 = 7
        page = firstPage + (addend);
      }
      // we add this validation to show the last seven pages. For that, we'll need to start from the lastPage
      // < 1 . 9 10 11 [12] >    WE CHANGE IT TO: < 1 . 6 7 8 9 10 11 [12] >
      // and
      // < 1 . 8 9 10 [11] 12 >    WE CHANGE IT TO: < 1 . 6 7 8 9 10 [11] 12 >
      else if((currentPage + 4) >= lastPage){
        //12 + -6 = 6
        //12 + -5 = 7
        //12 + -4 = 8
        //12 + -3 = 9
        //12 + -2 = 10
        //12 + -1 = 11
        //12 + -0 = 12
        page = lastPage + (addend);
      }
      //  Otherwise, there won't be any problems when trying to load the previous and next three pages. So, we keep the initial logic:
      else{
        page = currentPage + (addend);
      }

      // As we're already adding the firstPage above, we will prevent the loop from adding another firstPageElement.
      // We're also adding the lastPage based on certain conditions further below, so we'll prevent it from being added here as well
      if(page > 1 && page <= lastPage - 1){
        const element = <Link key={page} className={`WT-anchor pagination-item border-3 box-shadow-sm py-10 px-10 ${(currentPage === page) ? "" : "f-black-color bg-white"}`} to="" onClick={()=>changePage(page)}>
                            <span className="px-10">
                                {page}
                            </span>
                        </Link>;
        pages.push(element);
      }
      
      addend = addend + 1;
    }

    // If the current page is 6 or greater, we will display the last page element (this is for when totalPages is greater than 6)
    // If the currentPage is, at least, 4 pages away from the last page, we will also display the last page element (this is for when totalPages is less than 6)
    // now, we validate this first to push all elements in display order
    if( (currentPage >= 6) || ((currentPage + 4) >= lastPage)){
      
      //if the last page is 5 pages away from the current page, we will display a dot to give the appearance of a great distance
      if((lastPage - 4) > currentPage){
        const dotForDistanceElement = <label key={'lastPageDot'} className={`py-10 px-10`} >
                                        .
                                      </label>;
        pages.push(dotForDistanceElement);
      }

      //we will display the last page element just when it is different than the first page. Otherwise, we'd have duplicated elements
      if(firstPage < lastPage){
        const lastPageElement = <Link key={lastPage} className={`WT-anchor pagination-item border-3 box-shadow-sm py-10 px-10 ${(currentPage === lastPage) ? "" : "f-black-color bg-white"}`} to="" onClick={()=>changePage(lastPage)}>
                                    <span className="px-10">
                                        {lastPage}
                                    </span>
                                </Link>;
        pages.push(lastPageElement);
      }

    }

    return(
      pages
    )
  }

  return (
    <>
      <div className={"pagination-items d-flex flex-row align-items-center justify-content-center gap-10 my-20"}>  
        {
          ((currentPage > firstPage))
          ?
            <Link key={0} className={`WT-anchor pagination-item bg-white border-3 box-shadow-sm py-10 px-10`} to="" onClick={()=>goToPreviousPage()} >
              <i className="fa-solid fa-caret-left f-black-color px-10"></i>
            </Link>
          :
            null
        }

        {
          generatePages()
        }
        
        {
          (currentPage < lastPage)
          ?
            <Link key={lastPage + 1} className={`WT-anchor pagination-item bg-white border-3 box-shadow-sm py-10 px-10`} to="" onClick={()=>goToNextPage()}>
              <i className="fa-solid fa-caret-right f-black-color px-10"></i>
            </Link>
          :
            null
        }
      </div>
    </>
  )
}

export default PaginationBox;