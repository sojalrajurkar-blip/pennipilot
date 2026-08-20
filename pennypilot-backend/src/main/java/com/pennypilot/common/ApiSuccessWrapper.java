package com.pennypilot.common;

/**
 * Optional generic success wrapper for non-collection API responses.
 * Reserved for future use — V1 returns plain response objects directly.
 *
 * @param <T> the type of the response data
 */
public record ApiSuccessWrapper<T>(T data) {}
