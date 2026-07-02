import Banner from '@/components/Banner'

const page = () => {
  return (
    <div className="min-h-screen">
      <Banner />

      <div className="max-w-2xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-4">Contact getLancer</h1>
        <h3 className='font-medium'>
          <span className='text-sm font-normal'>Our mail:</span> <br />
          <span className='text-yellow text-md font-semibold'>getlancer796@gmail.com</span>
        </h3>
      </div>

      <div className="max-w-2xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-4">Contact Developer</h1>
        <h3 className='font-medium'>
          <span className='text-sm font-normal'>Our mail:</span> <br />
          <span className='text-yellow text-md font-semibold'>salunkheprathmesh0@gmail.com</span>
        </h3>
      </div>
    </div>
  )
}

export default page
