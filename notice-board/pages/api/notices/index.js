import { prisma } from "../../../lib/prisma";
import { asyncHandler } from "../../../utils/asyncHandler";
import { AppError } from "../../../utils/AppError";

const getNotice = async () => {
  return await prisma.notice.findMany({
    orderBy: { priority: "desc" },
  });
};

const createNotice = async (data) => {
  const { title, body, category, priority, publishDate } = data;

  if (!title || !body || !category || !priority || !publishDate) {
    throw new AppError("Missing required fields", 400);
  }

  if (isNaN(new Date(publishDate).getTime())) {
    throw new AppError("Invalid publish date", 400);
  }

  return await prisma.notice.create({
    data: {
      title,
      body,
      category,
      priority,
      publishDate: new Date(publishDate),
    },
  });
};

export default asyncHandler(async (req, res) => {
  switch (req.method) {
    case "GET": {
      const notices = await getNotice();

      return res.status(200).json({
        success: true,
        data: notices,
      });
    }

    case "POST": {
      const newNotice = await createNotice(req.body);

      return res.status(201).json({
        success: true,
        message: "Notice created successfully.",
        data: newNotice,
      });
    }

    default:
      return res.status(405).json({
        success: false,
        message: "Method Not Allowed",
      });
  }
});
