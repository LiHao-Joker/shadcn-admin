declare namespace API {
  
        type CreateUserRequest =
          {
              /** 用户名
             */
                'userName': string;
              /** 姓名
             */
                'name'?: string;
              /** 邮箱
             */
                'email'?: string;
              /** 手机
             */
                'mobile'?: string;
          }
        
  
        type DeleteUserEndpointParams =
          {
                'id': string;
          }
        
  
        type DeleteUserRequest = true;
  
        type GetProfileRequest = true;
  
        type GetProfileResponse =
          {
                'userName': string;
                'name': string;
                'mobile'?: string;
                'email'?: string;
                'avatar'?: string;
                'status': UserStatus;
          }
        
  
        type LockUserEndpointParams =
          {
                'id': string;
          }
        
  
        type LockUserRequest =
          {
                'status': UserStatus;
          }
        
  
        type PagedListOfUserDto =
          {
                'pageIndex'?: number;
                'pageSize'?: number;
                'count': number;
                'totalCount': number;
                'totalPages': number;
                'hasPreviousPage': boolean;
                'hasNextPage': boolean;
                'items'?: UserDto[];
          }
        
  
        type ProblemDetails =
          {
                'type': string;
                'title': string;
                'status': number;
                'instance': string;
                'traceId': string;
              /** the details of the error */
                'detail'?: string;
                'errors': ProblemDetailsError[];
          }
        
  
        type ProblemDetailsError =
          {
              /** the name of the error or property of the dto that caused the error */
                'name': string;
              /** the reason for the error */
                'reason': string;
              /** the code of the error */
                'code'?: string;
              /** the severity of the error */
                'severity'?: string;
          }
        
  
        type QueryPageEndpointParams =
          {
                'userName'?: string;
                'pageIndex': number;
                'pageSize': number;
                'status'?: UserStatus[];
          }
        
  
        type QueryPageRequest = true;
  
        type QueryPageResponse =
              // #/components/schemas/PagedListOfUserDto
              PagedListOfUserDto
         & 
          {}
        
  
        type QueryUserByIdEndpointParams =
          {
                'id': string;
          }
        
  
        type QueryUserByIdRequest = true;
  
        type QueryUserByIdResponse =
              // #/components/schemas/UserDto
              UserDto
         & 
          {}
        
  
        type RefreshTokenResponse =
              // #/components/schemas/TokenResponse
              TokenResponse
         & 
          {
                'accessTokenExpiry': string;
                'refreshTokenValidityMinutes': number;
          }
        
  
        type SignInRequest =
          {
              /** 用户名
             */
                'email': string;
              /** 密码
             */
                'password': string;
          }
        
  
        type SignUpRequest =
          {
                'userName': string;
                'email': string;
                'password': string;
                'name': string;
          }
        
  
        type TokenRequest =
          {
              /** unique identifier of a user */
                'userId': string;
              /** a single-use refresh token which will be valid for the duration specified by RefreshExpiry */
                'refreshToken': string;
          }
        
  
        type TokenResponse =
              // #/components/schemas/TokenRequest
              TokenRequest
         & 
          {
              /** the jwt access token which will be valid for the duration specified by AccessExpiry */
                'accessToken': string;
          }
        
  
        type UpdateUserRequest =
          {
                'id': string;
              /** 用户名
             */
                'userName': string;
              /** 姓名
             */
                'name': string;
              /** 邮箱
             */
                'email'?: string;
              /** 手机
             */
                'mobile'?: string;
          }
        
  
        type UserDto =
          {
                'id': string;
                'userName': string;
                'name': string;
                'status': UserStatus;
                'email'?: string;
                'mobile'?: string;
                'creationTime': string;
                'lastModificationTime'?: string;
          }
        
  
        type UserStatus = "Locked" | "CanUse";
  
}
