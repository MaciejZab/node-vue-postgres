import { Request, Response } from "express";
import { HttpResponseMessage } from "../../enums/response";
import { News } from "../../orm/entity/news/NewsEntity";

const addNews = async (_req: Request, res: Response) => {
  try {
    const newNews = new News();

    res.status(200).json({
      added: newNews,
      message: "News added successfully.",
      statusMessage: HttpResponseMessage.PUT_SUCCESS,
    });
  } catch (error) {
    console.error("Error adding news:", error);
    res.status(404).json({
      message: "Unknown error occurred. Failed to add news.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

const getNews = async (_req: Request, res: Response) => {
  try {
    const allNews = new News();

    res.status(200).json({
      news: allNews,
      message: "News retrieved successfully.",
      statusMessage: HttpResponseMessage.PUT_SUCCESS,
    });
  } catch (error) {
    console.error("Error retrieving news:", error);
    res.status(404).json({
      message: "Unknown error occurred. Failed to retrieve news.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

export { addNews, getNews };
