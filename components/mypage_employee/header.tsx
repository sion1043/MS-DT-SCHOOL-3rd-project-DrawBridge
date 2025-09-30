"use client"

interface HeaderProps {
  userProfile: {
    name: string
    avatar: string
  }
}

export function Header({ userProfile }: HeaderProps) {
  return (
    <div></div>
    // <header className="bg-primary text-black shadow-sm">
    //   <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    //     <div className="flex justify-between items-center h-16">
    //       <div className="flex items-center">
    //         <h1 className="text-xl font-bold text-black">마이페이지</h1>
    //       </div>
    //       <div className="flex items-center space-x-4">
    //         <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center text-lg">
    //           {userProfile.avatar}
    //         </div>
    //         <span className="text-sm font-medium text-black">{userProfile.name}님</span>
    //       </div>
    //     </div>
    //   </div>
    // </header>
  )
}
