import React from "react";

const Allborrowedbooks = ({ book }) => {

  const borrowedDate= new Date(book.borrowed_at);
  const dueDate= new Date(book.due_date);

  const isOverdue= new Date() > dueDate;
  const datediff= Math.floor((new Date()-dueDate)/ (1000*60*60*24));


  return (
       <div className="flex px-6 py-4 items-center hover:bg-indigo-50 transition-colors duration-150">

  
      <div className="flex-1 flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm uppercase">
          {book.username?.charAt(0)}
        </div>
        <span className="text-gray-800 font-medium">{book.username}</span>
      </div>

     
      <div className="flex-1 flex items-center text-gray-700 text-sm">
         <span className="ml-2">{book.bookname}</span>
      </div>

      
      <div className="flex-1 flex items-center text-gray-700 text-sm">
         <span className="ml-2">{book.author}</span>
      </div>

    
      <div className="flex-1 flex items-center text-gray-500 font-semibold text-sm">
         <span className="ml-2">{borrowedDate.toLocaleDateString()}</span>
      </div>


      <div className="flex-1 flex items-center text-sm">
        {isOverdue ? (
          <span className="bg-red-100 text-red-600 text-xs font-semibold px-2 py-1 rounded-full">
             Overdue by {datediff} days
            ({dueDate.toLocaleDateString()})
          </span>
        ) : (
          <span className=" text-green-500 text-sm font-semibold px-2 py-1 rounded-full">
             {new Date(book.due_date).toLocaleDateString()}
          </span>
        )}
      </div>

    </div>
  );
};

export default Allborrowedbooks;