// components/ProfileCard.js
export default function ProfileCard() {
    return (
      <div className="max-w-sm mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
        <div className="md:flex">
          <div className="md:shrink-0">
            <img
              className="h-48 w-full object-cover md:w-48"
              src="https://images.unsplash.com/photo-1557683316-973673baf926"
              alt></img>
          </div>
          <div className="p-8">
            <h2 className="block mt-1 text-lg leading-tight font-medium text-black">
              John Doe
            </h2>
            <p className="mt-2 text-gray-500">
              John is a web developer with a passion for creating beautiful, responsive web experiences.
            </p>
            <button className="mt-4 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700">
              Follow
            </button>
          </div>
        </div>
      </div>
    );
  }
  