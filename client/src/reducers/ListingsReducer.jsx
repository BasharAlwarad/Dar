const listingReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LAST_FETCHED_LISTING':
      return {
        ...state,
        lastFetchedListings: action.payload,
      };
    case 'SET_LISTINGS':
      return {
        ...state,
        listings: action.payload,
        loading: false,
      };
    case 'SET_SHOW_MORE_LISTINGS':
      return {
        ...state,
        listings: [...state.listings, action.payload],
        loading: false,
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    default:
      return state;
  }
};

export default listingReducer;

// const listingReducer = (state = {}, action) => {
//   //   console.log(action.payload);
//   switch (action.type) {
//     case 'SET_LAST_FETCHED_LISTING':
//       return {
//         ...state,
//         lastFetchedListing: action.payload,
//       };
//     case 'SET_LISTINGS':
//       return {
//         ...state,
//         listings: action.payload,
//         // listings: [...state.listings, action.payload],
//         loading: false,
//       };
//     case 'SET_LOADING':
//       return {
//         ...state,
//         loading: action.payload,
//       };
//     default:
//       return state;
//   }
// };

// export default listingReducer;
