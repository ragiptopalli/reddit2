import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export interface Scalars {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTimeISO: { input: any; output: any; }
}

export interface FieldError {
  field: Scalars['String']['output'];
  message: Scalars['String']['output'];
}

export interface Mutation {
  createPost: Post;
  deletePost: Scalars['Boolean']['output'];
  login: UserResponse;
  register: UserResponse;
  updatePost?: Maybe<Post>;
}


export interface MutationCreatePostArgs {
  text?: InputMaybe<Scalars['String']['input']>;
  title: Scalars['String']['input'];
}


export interface MutationDeletePostArgs {
  id: Scalars['String']['input'];
}


export interface MutationLoginArgs {
  options: UsernamePasswordInput;
}


export interface MutationRegisterArgs {
  options: UsernamePasswordInput;
}


export interface MutationUpdatePostArgs {
  id: Scalars['String']['input'];
  text?: InputMaybe<Scalars['String']['input']>;
  title: Scalars['String']['input'];
}

export interface Post {
  createdAt: Scalars['DateTimeISO']['output'];
  id: Scalars['String']['output'];
  text?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
  updatedAt: Scalars['DateTimeISO']['output'];
}

export interface Query {
  me?: Maybe<User>;
  post?: Maybe<Post>;
  posts: Array<Post>;
}


export interface QueryPostArgs {
  id: Scalars['String']['input'];
}

export interface User {
  createdAt: Scalars['DateTimeISO']['output'];
  id: Scalars['String']['output'];
  updatedAt: Scalars['DateTimeISO']['output'];
  username: Scalars['String']['output'];
}

export interface UserResponse {
  errors?: Maybe<Array<FieldError>>;
  user?: Maybe<User>;
}

export interface UsernamePasswordInput {
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
}

export type LoginMutationVariables = Exact<{
  options: UsernamePasswordInput;
}>;


export type LoginMutation = { login: { errors?: Array<{ field: string, message: string }> | null, user?: { username: string, id: string } | null } };

export type RegisterUserMutationVariables = Exact<{
  options: UsernamePasswordInput;
}>;


export type RegisterUserMutation = { register: { errors?: Array<{ field: string, message: string }> | null, user?: { username: string } | null } };


export const LoginDocument = gql`
    mutation Login($options: UsernamePasswordInput!) {
  login(options: $options) {
    errors {
      field
      message
    }
    user {
      username
      id
    }
  }
}
    `;
export type LoginMutationFn = Apollo.MutationFunction<LoginMutation, LoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      options: // value for 'options'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: Apollo.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, options);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export const RegisterUserDocument = gql`
    mutation RegisterUser($options: UsernamePasswordInput!) {
  register(options: $options) {
    errors {
      field
      message
    }
    user {
      username
    }
  }
}
    `;
export type RegisterUserMutationFn = Apollo.MutationFunction<RegisterUserMutation, RegisterUserMutationVariables>;

/**
 * __useRegisterUserMutation__
 *
 * To run a mutation, you first call `useRegisterUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerUserMutation, { data, loading, error }] = useRegisterUserMutation({
 *   variables: {
 *      options: // value for 'options'
 *   },
 * });
 */
export function useRegisterUserMutation(baseOptions?: Apollo.MutationHookOptions<RegisterUserMutation, RegisterUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RegisterUserMutation, RegisterUserMutationVariables>(RegisterUserDocument, options);
      }
export type RegisterUserMutationHookResult = ReturnType<typeof useRegisterUserMutation>;
export type RegisterUserMutationResult = Apollo.MutationResult<RegisterUserMutation>;