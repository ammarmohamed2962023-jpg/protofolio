import { NextResponse } from 'next/server';

/**
 * Standardized Success Response
 * @param {Object|Array} data
 * @param {string} message
 * @param {Object} meta
 * @param {number} status
 */
export function apiSuccess(data = {}, message = '', meta = {}, status = 200) {
  return NextResponse.json(
    {
      success: true,
      message,
      data,
      meta,
    },
    { status }
  );
}

/**
 * Standardized Error Response
 * @param {string} code
 * @param {string} message
 * @param {number} status
 * @param {Object} details
 */
export function apiError(code = 'INTERNAL_ERROR', message = 'An error occurred', status = 500, details = null) {
  const body = {
    success: false,
    error: {
      code,
      message,
    },
  };

  if (details) {
    body.error.details = details;
  }

  return NextResponse.json(body, { status });
}
