package com.pennypilot.common;

import java.util.List;

/**
 * Reserved for V2 pagination support. Not used in V1.
 *
 * @param <T> the type of the page content items
 */
public record PageResponse<T>(
        List<T> content,
        int page,
        int size,
        long totalElements,
        int totalPages,
        boolean last
) {}
