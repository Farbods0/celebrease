/**
 * User-facing DTO for POST /order/me/:id/return.
 * Intentionally empty — users must not be able to set the return label or
 * tracking. Those are admin-only fields written via SetReturnLabelDto.
 */

export class RequestReturnDto {}
