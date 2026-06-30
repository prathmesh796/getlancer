import Banner from '@/components/Banner'

const page = () => {
  return (
    <div className="min-h-screen">
      <Banner />

      <div className="max-w-2xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-4">About getLancer</h1>
        <p className="mb-2">
          <strong>getLancer</strong> is an easy-to-use and efficient freelancing platform designed to help newcomers take their first steps into the freelance world. Whether you're a student looking to build experience, or an aspiring freelancer making your debut, getLancer offers a friendly environment tailored to your needs.
        </p>
        <p>
          Our mission is to bridge the gap between new talent and real project opportunities. With features simplifying the job search, project posting, and secure transfers, we empower our users to learn, earn, and grow in the digital economy.
        </p>
      </div>
    </div>
  )
}

export default page
