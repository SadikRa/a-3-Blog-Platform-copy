/* eslint-disable @typescript-eslint/no-explicit-any */
import { StatusCodes } from 'http-status-codes';
import { IBlog } from './blog.interface';
import { Blog } from './blog.model';
import AppError from '../../errors/AppError';
import QueryBuilder from '../../builder/QueryBuilder';
import { blogSearchableFields } from './blog.constant';

// Create blog
const createBlogIntoDB = async (user: any, data: IBlog) => {
  if (user.role !== 'user') {
    throw new AppError(StatusCodes.FORBIDDEN, 'Only users can create blogs');
  }

  data.author = user.email;
  const result = await Blog.create(data);

  return result.populate('author');
};

// Update blog
const updateBlogIntoDB = async (blogID: string, data: Partial<IBlog>) => {
  const blog = await Blog.findById(blogID);
  if (!blog) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Blog not found!');
  }

  const updatedBlog = await Blog.findByIdAndUpdate(blogID, data, {
    new: true,
    runValidators: true,
  });

  if (!updatedBlog) {
    throw new AppError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Failed to update the blog',
    );
  }

  return updatedBlog;
};

// Delete a blog from the database
const deleteBlogFromDB = async (blogId: string) => {
  const blog = await Blog.findById(blogId).populate('author');

  if (!blog) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Blog not found!');
  }

  await Blog.findByIdAndDelete(blogId);

  return { success: true };
};

// Get all blogs
const getAllBlogFromDB = async (query: Record<string, unknown>) => {
  const blogQuery = new QueryBuilder(Blog.find().populate('author'), query)
    .search(blogSearchableFields)
    .filter() // No need to pass filterableFields here
    .sort()
    .paginate()
    .fields();

  const result = await blogQuery.queryResult();
  return result;
};

export const blogService = {
  createBlogIntoDB,
  updateBlogIntoDB,
  deleteBlogFromDB,
  getAllBlogFromDB,
};