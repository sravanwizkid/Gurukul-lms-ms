export interface RouteLayer {
  route?: {
    path: string;
    methods: {
      [key: string]: boolean;
    };
  };
  name?: string;
  handle?: Function;
} 