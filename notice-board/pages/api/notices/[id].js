import { prisma } from "../../../lib/prisma";
import { asyncHandler } from "../../../utils/asyncHandler";
import { AppError } from "../../../utils/AppError";

const getNoticeById = async (id) => {
  const notice = await prisma.notice.findUnique({
    where: { id },
  });
  if (!notice) {
    throw new AppError("Notice not found", 404);
  }
   return notice;
};

const updateNotice = async (id, data) => {
  const { title, body, category, priority, publishDate } = data;

  if (!title || !body || !category || !priority || !publishDate) {
    throw new AppError("Missing required fields", 400);
  }

  if (isNaN(new Date(publishDate).getTime())) {
    throw new AppError("Invalid publish date", 400);
  }

  const updatedNotice = await prisma.notice.update({
    where: { id },
    data: {
      title,
      body,
      category,
      priority,
      publishDate: new Date(publishDate),
    },
  });
  return updatedNotice;
};

export const deleteNotice = async (id) => {
  const notice = await prisma.notice.findUnique({
    where: { id },
  });

  if (!notice) {
    throw new AppError("Notice not found", 404);
  }
  const deletedNotice = await prisma.notice.delete({
    where: { id },
  });
  return deletedNotice;
};

export default asyncHandler(async (req, res) => {
  const { id } = req.query;
  switch (req.method) {
    case "GET": {
      const notice = await getNoticeById(parseInt(id));
      return res.status(200).json({
        success: true,
        data: notice,
      });
    }
    case "PUT": {
      const updatedNotice = await updateNotice(parseInt(id), req.body);
      return res.status(200).json({
        success: true,
        message: "Notice updated successfully.",
        data: updatedNotice,
      });
    }
    case "DELETE": {
      const deletedNotice = await deleteNotice(parseInt(id));
      return res.status(200).json({
        success: true,
        message: "Notice deleted successfully.",
        data: deletedNotice,
      });
    }
    default:
      return res.status(405).json({
        success: false,
        message: "Method Not Allowed",
      });
  }
});
