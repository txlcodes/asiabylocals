
export interface Country {
  id: string;
  name: string;
  image: string;
  localAngle: string;
  guidesCount: number;
}

export interface AttractionCard {
  id: string;
  title: string;
  location: string;
  whyLocal: string;
  experts: number;
  image: string;
}

export interface SignatureExperience {
  id: string;
  category: string;
  title: string;
  guideName: string;
  guideAvatar: string;
  location: string;
  price: number;
  rating: number;
  reviews: number;
  duration: string;
  image: string;
  isOriginal?: boolean;
}

export interface LocalGuide {
  name: string;
  role: string;
  avatar: string;
  location: string;
  quote: string;
  rating: number;
  years: number;
}
