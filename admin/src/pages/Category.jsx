import { useEffect, useState } from 'react'
import CategoryTable from '../components/category/CategoryTable'
import Pagination from '../components/pagination/Pagination';
import AddCategory from '../components/category/AddCategory';
import axios from '../axios/axios'
import { FaPlus } from 'react-icons/fa'
import { toast } from 'react-toastify';
function Category() {
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  useEffect(() => {
    const getCategories = async () => {
      try {
        const response = await axios.get(`/admin/categories?page=${page}`);
        setCategories(response.data.categories);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    }
    getCategories();
  }, [page]);

  const changeStatus = async (categoryId, action) => {
    try {
      const response = await axios.patch(`/admin/updateCategoryStatus/${categoryId}`, { action });
      if (response.data.success) {
        // update category list
        toast.success(response.data.message);
        setCategories(prevCategories =>
          prevCategories.map(category =>
            category._id === categoryId ? { ...category, isActive: action === 'block' ? false : true } : category
          )
        );
      }
      return response.data;
    }
    catch (error) {
      toast.error(error.response.data.message);
      return { success: false, message: error.response.data.message };
    }
  }

  const updateCategory = async (categoryId, values) => {
    try {
      const response = await axios.put(`/admin/updateCategory/${categoryId}`, values);
      setCategories(prevCategories =>
        prevCategories.map(category =>
          category._id === categoryId ? { ...category, ...values } : category
        )
      );
      return response;
    }
    catch (error) {
      return error;
    }
  }
  return (
    <div className='flex justify-center pt-10'>
      <div className=''>
        <button className='bg-black hover:bg-gray-700 text-white font-bold py-2 px-4 rounded flex items-center gap-2' onClick={() => setShowAddCategoryModal(true)}><FaPlus className='text-2xl' />Create Category</button>
        <CategoryTable categories={categories} changeStatus={changeStatus} updateCategory={updateCategory} />
        <div className='mt-5'>
          <Pagination total={totalPages} current={page} setPage={setPage} />
        </div>
      </div>
      {showAddCategoryModal && <AddCategory setShowAddCategoryModal={setShowAddCategoryModal} setCategories={setCategories} />}
    </div>
  )
}

export default Category
