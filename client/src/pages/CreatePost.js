import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';

const categoriesList = [
  "Fashion", "Beauty", "Travel", "Lifestyle", "Personal", "Tech", "Health",
  "Fitness", "Wellness", "SaaS", "Business", "Education", "Food and Recipe",
  "Love and Relationships", "Alternative topics", "Green living", "Music",
  "Automotive", "Marketing", "Internet services", "Finance", "Sports",
  "Entertainment", "Productivity", "Hobbies", "Parenting", "Pets",
  "Photography", "Agriculture", "Art", "DIY", "Science", "Gaming",
  "History", "Self-improvement", "News and current affairs"
];

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState([]);
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://127.0.0.1:5000/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-auth-token': token,
        },
      });
      setImageUrl(res.data.url);
      toast.success('Image uploaded successfully!');
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Image upload failed.';
      console.error('Image upload failed', err);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category) => {
    setTags(prevTags =>
      prevTags.includes(category)
        ? prevTags.filter(tag => tag !== category)
        : [...prevTags, category]
    );
  };

  const handleSubmit = async (status) => {
    if (!title || !content) {
      return toast.error('Title and content are required.');
    }
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const newPost = {
        title,
        content,
        tags: tags,
        coverImage: imageUrl,
        status: status,
      };
      const { data } = await axios.post('http://127.0.0.1:5000/api/blogs', newPost, {
        headers: { 'x-auth-token': token },
      });
      toast.success(`Post ${status === 'published' ? 'published' : 'saved as draft'} successfully!`);
      navigate(`/blogs/${data._id}`);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to save post.';
      console.error('Error saving post:', err);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  const modules = {
    toolbar: [
      [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
      [{size: []}],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'image', 'video'],
      ['clean']
    ],
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Create New Post</h1>
      <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>
        <div>
            <label htmlFor="coverImage" className="block text-sm font-medium text-gray-700">Cover Image</label>
            <input
                type="file"
                id="coverImage"
                onChange={handleFileChange}
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
            />
            {imageUrl && <img src={imageUrl} alt="Cover" className="mt-4 h-48 w-auto"/>}
        </div>
        <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700">Content</label>
            <ReactQuill
                theme="snow"
                value={content}
                onChange={setContent}
                modules={modules}
                className="bg-white"
            />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Categories</label>
          <div className="mt-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {categoriesList.map(category => (
              <div key={category} className="flex items-center">
                <input
                  type="checkbox"
                  id={category}
                  checked={tags.includes(category)}
                  onChange={() => handleCategoryChange(category)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor={category} className="ml-2 block text-sm text-gray-900">
                  {category}
                </label>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-4">
          <button onClick={() => handleSubmit('draft')} className="flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            Save as Draft
          </button>
          <button onClick={() => handleSubmit('published')} className="flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
            Publish
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
