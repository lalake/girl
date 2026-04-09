import axios from 'axios';

export interface VideoData {
  id: number;
  category: string;
  video: string;
  timestamp: number;
}

export interface VideoResponse {
  status: string;
  data: VideoData;
}

export type CategoryType = 'baisi' | 'heisi' | 'gaozhiliang' | 'chuanda' | 'shejie' | 'qingchun' | 'rewu' | 'nvda' | 'jk';

export const CATEGORIES: Record<CategoryType, string> = {
  baisi: '随机百思视频',
  heisi: '随机黑丝视频',
  gaozhiliang: '随机高质量视频',
  chuanda: '随机穿搭视频',
  shejie: '随机街拍视频',
  qingchun: '随机清纯视频',
  rewu: '随机热舞视频',
  nvda: '随机女大视频',
  jk: '随机视频'
};

const API_BASE_URL = 'https://wzapi.com/api/sjxjjsp';

export const fetchVideo = async (category: CategoryType): Promise<VideoData> => {
  try {
    const response = await axios.get<VideoResponse>(API_BASE_URL, {
      params: {
        format: 'json',
        category
      }
    });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching video:', error);
    throw error;
  }
};
